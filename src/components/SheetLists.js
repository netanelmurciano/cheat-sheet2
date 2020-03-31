import React, {Component} from 'react';
import {Accordion, Card, Button} from 'react-bootstrap'
import firebase from "../firebase";

class SheetLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
            isEditView: false,
        };
        this.db = firebase.firestore();

    }

    // We delete the row and pass arg to isRowDeleted function
    deleteRow(id) {
        let that = this;
        this.db.collection(`sheets`).doc(id).delete().then(function () {
                console.log("row successfully deleted!");
                that.setState({deleted: true});
                // After we delete the row we pass arg = true , we do that to refresh the page
                that.props.isRowDeleted(true);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    // We pass the row that we want to edit
    editRow(row) {
        if(row) {
            this.props.isRowEdit(row);
            this.setState({isEditView: true})
        }
    }

    // Cancel edit
    cancelEdit() {
        this.props.isRowCancel('cancel');
        this.setState({isEditView: false})
    }

    render() {
        return (
            <div>
                {
                    this.props.lists.length > 0 ?
                        this.props.lists.map((item, key) =>
                            <div key={key} className="border-bottom">
                                <Accordion>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Card.Header} variant="link" eventKey={key}>
                                                <span>{item.name}</span> <span>({item.language})</span>
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={key}>
                                            <Card.Body>
                                                <div>{item.code}</div>
                                                <div className="py-3">{item.link}</div>
                                                <div className="d-flex justify-content-end">
                                                    {
                                                        this.state.isEditView
                                                            ?
                                                            <div className="btn-group mr-2" onClick={e => this.cancelEdit()}>
                                                                <button type="button"
                                                                        className="border border-dark rounded-circle position-relative p-2 mr-1 bg-white">
                                                                    <i className="fa fa-plus xy-align cursor-pointer text-1"
                                                                       aria-hidden="true"></i>
                                                                </button>
                                                            </div>
                                                            :
                                                            <div className="btn-group mr-2" onClick={e => this.editRow(item)}>
                                                                <button type="button"
                                                                        className="border border-dark rounded-circle position-relative p-2 mr-1 bg-white">
                                                                    <i className="fa fa-pencil xy-align cursor-pointer text-1"
                                                                       aria-hidden="true"></i>
                                                                </button>
                                                            </div>
                                                    }

                                                    <div className="btn-group" onClick={e => this.deleteRow(item.id)}>
                                                        <button type="button"
                                                                className="border border-dark rounded-circle position-relative p-2 mr-1 bg-white">
                                                            <i className="fa fa-times xy-align cursor-pointer text-1 "
                                                               aria-hidden="true"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </div>
                        )
                        :
                        <div> No data</div>
                }
            </div>
        );
    }
}

export default SheetLists;