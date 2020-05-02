/* global chrome */
import React, { Component } from 'react';
import "../css/App.css";
import "../css/google-btn.css";
import "../css/bootstrap.css";
import Popup from "./Popup";
import Login from "./Login";
import $ from "jquery";

class App extends Component {
   constructor() {
       super();

       this.state = {
           userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false,
           isLoginClicked: false
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
               console.log(token);
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

    // Sign out
    handleSignOut(e) {
       if(localStorage.getItem('gToken')) {
           let token = localStorage.getItem('gToken');
           if(window.confirm('Are you sure you want to sign out?')) {
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
    }

    // Open and close toggle form
    toggleForm() {
       let plusIcon = $('.circle-plus');
        plusIcon.toggleClass('opened');
        if(plusIcon.hasClass('opened') ){
            $('.form-collapse').addClass('show');
        } else {
            $('.form-collapse').removeClass('show');
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
               <div className="col-12 main d-flex w-100">
                   <div className="row w-100">
                       <div className="col-6">
                           <div className="circle-plus closed opened d-flex"  onClick={this.toggleForm}>
                               <div className="circle align-self-center">
                                   <div className="horizontal"></div>
                                   <div className="vertical"></div>
                               </div>
                           </div>
                       </div>
                       <div className="col-6 text-right align-self-center" onClick={e => this.handleSignOut(e)}>
                           <i className="fa fa-sign-out fa-1x" aria-hidden="true"></i>
                       </div>
                   </div>
               </div>
               <Popup userId={this.state.userInfo.id}/>
           </div>
       )
   }

  render() {
    return (
        <div className="container">
            {this.loadTemplate()}
        </div>
    );
  }
}

export default App;
