import React, {Component} from 'react';
import {Accordion, Card} from 'react-bootstrap'
import firebase from "../firebase";
import $ from "jquery";

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
            that.setState({deleted: true});
            // After we delete the row we pass arg = true , we do that to refresh the page
            that.props.isRowDeleted(true);
        })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

    }

    // We pass the row which want to edit
    editRow(row) {
        if(row) {
            this.props.isRowEdit(row);
            $('.list-wrapper').addClass('d-none');
            //$("#pencil_"+row.id).addClass('d-none');
            //$("#times_"+row.id).removeClass('d-none');
            this.setState({isEditView: true})
        }
    }

    // Cancel edit
    cancelEdit(row) {
        if(row) {
            this.props.isRowCancel('cancel');
            //$("#pencil_"+row.id).removeClass('d-none');
            //$("#times_"+row.id).addClass('d-none');
            this.setState({isEditView: false})
        }

        //this.setState({isEditView: false})
    }

    render() {
        this.props.lists.push({
            'code': 'nnn',
            'language': 'angular',
            'link': 'mako',
            'name': 'nnnnnn',
            'userId': '108673037216498992539'
        });
        return (
            <div>
                {
                    this.props.lists.length > 0 ?
                        this.props.lists.map((item, key) =>
                            <div key={key} className="border-bottom mb-2">
                                <Accordion>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Card.Header} variant="link" eventKey={key}>
                                                <span>{item.name}</span> <span className='font-weight-bold'>({item.language})</span>
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={key}>
                                            <Card.Body>
                                                <div>{item.code}</div>
                                                <div className="py-3"><a href={item.link} target="_blank">Open Url</a></div>
                                                <div className="d-flex justify-content-end">


                                                           {/* <div id={"times_" + item.id} className="btn-group mr-2 d-none"   onClick={e => this.cancelEdit(item)}>
                                                                <button type="button" className="border border-dark rounded-circle position-relative  mr-1 bg-white" style={{"height" : "27px", "width" : "27px"}}>
                                                                    <i className="fa fa-times xy-align cursor-pointer text-1"
                                                                       aria-hidden="true"></i>
                                                                </button>
                                                            </div>*/}

                                                            <div id={"pencil_" + item.id} className="btn-group mr-2"  onClick={e => this.editRow(item)}>
                                                                <button type="button" className="edit-btn border border-dark rounded-circle position-relative  mr-1 bg-white" style={{"height" : "27px", "width" : "27px"}}>
                                                                    <i className="fa fa-pencil xy-align cursor-pointer text-1"
                                                                       aria-hidden="true"></i>
                                                                </button>
                                                            </div>


                                                    <div className="btn-group" onClick={(e) =>{if (window.confirm('Are you sure you wish to delete this item?')) this.deleteRow(item.id)}}>
                                                        <button type="button"
                                                                className="border border-dark rounded-circle position-relative  mr-1 bg-white" style={{"height" : "27px", "width" : "27px"}}>
                                                            <i className="fa fa-trash xy-align cursor-pointer text-1 "
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
