/* global chrome */
import React, { Component } from 'react';
import "../css/App.css";
import "../css/google-btn.css";
import "../css/bootstrap.css";
import Header from './common/Header'
import Popup from "./Popup";
import Login from "./Login";

class App extends Component {
   constructor() {
       super();

       this.state = {
           usersInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : false
       };

   }
   handleSignIn() {
       chrome.identity.getAuthToken({
           interactive: true
       }, function(token) {
           if (chrome.runtime.lastError) {
               alert(chrome.runtime.lastError.message);
               return;
           }
           var x = new XMLHttpRequest();
           x.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token);
           x.onload = () => {
               let userInfo = x.response;
               sessionStorage.setItem('userInfo', userInfo);
               window.location.reload();
           };
           x.send();
       });
   }

   loadTemplate() {
       if(!this.state.usersInfo.id) {
           return (
               <div onClick={this.handleSignIn} className="row main">
                   <Login />
               </div>
           );
       }
       return (
           <div className="row main">
               <Header />
               <Popup userId={this.state.usersInfo.id}/>
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
