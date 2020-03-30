import React, { Component } from 'react';
import "./App.css";
import "./bootstrap.css";
import Popup from "./components/popup";


class App extends Component {
  render() {
    return (
        <div className="container">
          <Popup />
        </div>
    );
  }
}

export default App;
