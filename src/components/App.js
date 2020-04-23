/* global chrome */
import React, { Component } from 'react';
import "../css/App.css";
import "../css/google-btn.css";
import "../css/bootstrap.css";
import Popup from "./Popup";
import Login from "./Login";
import LogOut from "./LogOut";

class App extends Component {
   constructor() {
       super();

       this.state = {
           userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : false
       };

      // this.handleSignIn = this.handleSignIn.bind(this);
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

   loadTemplate() {
       if(!localStorage.getItem('gToken')) {
           return (
               <div onClick={this.getAuthToken} className="row main">
                   <Login />
               </div>
           );
       }
       return (
           <div className="row main">
               <div onClick={e => this.handleSignOut(e)} className="row main">
                   <LogOut />
               </div>
               <Popup userId={this.state.userInfo.id}/>
           </div>
       )
   }

  render() {
       console.log(this.state);
    return (
        <div className="container">
            {this.loadTemplate()}
        </div>
    );
  }
}

export default App;
