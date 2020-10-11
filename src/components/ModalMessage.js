import React, {Component} from 'react';
import {Button, Modal} from 'react-bootstrap'

class ModalMessage extends Component {
    render() {
        return (
            <div>
                <Modal
                    show={this.props.show}
                    onHide={this.props.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Tag</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you wish to delete this tag?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={(e) => this.props.deleteRow(this.props.rowId)}>
                            Continue
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ModalMessage;
