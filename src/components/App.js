/* global chrome */
import React, { Component } from 'react';
import "../css/App.css";
import "../css/google-btn.css";
import "../css/btn.css";
import Popup from "./Popup";
import Login from "./Login";
import $ from "jquery";
import 'react-toastify/dist/ReactToastify.css';
import Notify from "./common/Notify";
import ModalSignOut from './ModalSignOut'
import ModalMessage from "./ModalMessage";

class App extends Component {
   constructor() {
       super();

       this.state = {
           userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false,
           isLoginClicked: false,
           showNoti: false,
           notiType: '',
           show: false
       };

      this.handleClickLogin = this.handleClickLogin.bind(this);
   }

   // We handle sign in button
   handleClickLogin(e, isLoginClicked) {
       if(isLoginClicked) {
           this.setState({isLoginClicked: isLoginClicked});
           this.getAuthToken()
       }
   }

    // Get google account token
    getAuthToken() {
       chrome.identity.getAuthToken({interactive: true}, (token) => {
           if(token) {
               localStorage.setItem('gToken', token);
               var x = new XMLHttpRequest();
               x.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
               x.onload = () => {
                   let userInfo = x.response;
                   localStorage.setItem('userInfo', userInfo);
                   window.location.reload();
               };
               x.send();
           } else {
               if (chrome.runtime.lastError) {
                   console.log(chrome.runtime.lastError.message);
                   return;
               }
           }
       });
   }

    handleOpenModal = (e) => {
        this.setState({
            show: true
        });
    };
    handleClose = () => {
        this.setState({
            show: false,
        });
    };

    // Sign out
    handleSignOut() {
       if(localStorage.getItem('gToken')) {
           let token = localStorage.getItem('gToken');
               // we logout from app
               window.fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token);
               // we clean the token from chrome
               chrome.identity.removeCachedAuthToken({ token: token },
                   function() {
                       console.log("Cached token has been removed")
                   });
               // clean local storage
               localStorage.removeItem('gToken');
               localStorage.removeItem('userInfo');
               window.location.reload();
       }
    }

    // Open and close toggle form
    toggleForm() {
       let plusIcon = $('.circle-plus');
        plusIcon.toggleClass('opened');
        if(plusIcon.hasClass('opened') ){
            $('.form-collapse').addClass('show');
            $('.card-header').addClass('d-none');
            $('.list-wrapper').addClass('d-none');
        } else {
            $('.form-collapse').removeClass('show');
            $('.card-header').removeClass('d-none');
            $('.list-wrapper').removeClass('d-none');
        }
    }

   loadTemplate() {
       if(!localStorage.getItem('gToken')) {
           return (
               <div className="row main">
                   <Login handleClickLogin={this.handleClickLogin} />
               </div>
           );
       }
       return (
           <div className="row main">
               {this.state.show ? this.loadModal() : ''}
               <div className="col-12">
                   <div className="row">
                       <div className="col-6">
                           <div className="circle-plus closed opened d-flex"  onClick={this.toggleForm}>
                               <div className="circle align-self-center">
                                   <div className="horizontal"></div>
                                   <div className="vertical"></div>
                               </div>
                           </div>
                       </div>
                       <div className="col-6 text-right align-self-center" onClick={e => this.handleOpenModal(e)}>
                           <i className="fa fa-sign-out fa-1x" aria-hidden="true"></i>
                       </div>
                   </div>
               </div>
               <Popup userId={this.state.userInfo.id} loadNotify={this.loadNotify}/>
           </div>
       )
   }

    loadModal = () => {
        return(
            <ModalSignOut show={this.state.show} handleClose={this.handleClose} handleSignOut={this.handleSignOut}  />
        )
    };

    loadNotify = (type, message) => {
       if(type) {
           this.setState({
               showNoti: true,
               notiType: {type},
               notiMessage: {message},
           }, () => {
               setTimeout(() => {
                   this.setState({showNoti: false})
               },2000)
           })
       }
   };
  render() {
    return (
        <div className="container">
            {
                this.state.showNoti ?
                    <Notify
                        type={this.state.notiType}
                        message={this.state.notiMessage}
                    />
                    :
                    ''
            }
            {this.loadTemplate()}
        </div>
    );
  }
}

export default App;
