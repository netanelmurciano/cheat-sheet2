import React, {Component} from 'react';
import {toast, ToastContainer} from "react-toastify";

class Notify extends Component {
    constructor(props) {
        super(props)
    }
    notify = () => {
        if(this.props.type.type === 'success') {
            toast.success(this.props.message.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    render() {
        this.notify();
        return (
            <div>
                <ToastContainer/>
            </div>
        );
    }
}

export default Notify;
