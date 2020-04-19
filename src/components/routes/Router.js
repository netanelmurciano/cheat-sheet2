import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";

import Login from '../Login';

class RouterComponent extends Component {
    render() {
        return (
            <div className="row">
                <Router>
                    <Switch>
                        <Route path="/" component={Login}  exact/>
                        <Route component={Error} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default RouterComponent;