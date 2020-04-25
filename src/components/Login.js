import React, {Component} from 'react';

class Login extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="d-flex justify-content-center h-200 w-100">
                <div className="google-btn align-self-center" onClick={(e) => this.props.handleClickLogin(e, true)}>
                    <div className="google-icon-wrapper">
                        <img className="google-icon"
                             src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                    </div>
                    <p className="btn-text"><b>Sign in with google</b></p>
                </div>
            </div>
        );
    }
}

export default Login;