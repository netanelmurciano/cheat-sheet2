import React, {Component} from 'react';
import {Button, Modal} from 'react-bootstrap'

class ModalMessage extends Component {
    render() {
        return (
            <div>
                <Modal
                    show={this.props.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Sign Out</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you wish to sign out?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.props.handleSignOut()}>
                            Continue
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ModalMessage;
