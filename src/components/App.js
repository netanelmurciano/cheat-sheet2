import React, { Component } from 'react';
import "../App.css";
import "../bootstrap.css";
import Header from './common/Header'
import Popup from "./Popup";

class App extends Component {
  render() {
    return (
        <div className="container">
            <div className="row main">
                <Header />
                <Popup />
            </div>

        </div>
    );
  }
}

export default App;
