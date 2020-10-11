import React, {Component} from 'react';
import {Accordion, Card} from 'react-bootstrap'
import firebase from "../firebase";
import $ from "jquery";
import ModalMessage from './ModalMessage'

class SheetLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
            isEditView: false,
            show: false,
            rowDeleteId: ''
        };
        this.db = firebase.firestore();

        this.deleteRow = this.deleteRow.bind(this);


    }

    showLists() {
        if (this.props.lists.length > 0) {
            return (<div className="border-bottom">
                    <Accordion>
                        {this.props.lists.map((item, key) => {
                            let listKey = key + 1;
                            return (
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey={listKey}>
                                            <span>{item.name}</span> <span
                                            className='font-weight-bold'>({item.language})</span>
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={listKey}>
                                        <Card.Body>
                                            <div>
                                                <span id={'limit-text-id_' + listKey}
                                                      className={'limit-text text-color-2'}>{item.code}</span>
                                                <p className={'small w-25 cursor-pointer text-color-1 read-more-text_' + listKey}
                                                   onClick={e => this.readMore(e, {listKey}, 'read-more')}>Read more</p>
                                                <p className={'small w-25 cursor-pointer text-color-1 d-none less-text_' + listKey}
                                                   onClick={e => this.readMore(e, {listKey}, 'less')}>Read less</p>
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <a href={item.link} target="_blank">
                                                    <div className="btn-group mr-2">
                                                        <button type="button"
                                                                className="edit-btn border border-dark rounded-circle position-relative  mr-1 bg-white"
                                                                style={{"height": "27px", "width": "27px"}}>
                                                            <i className="fa fa-link xy-align cursor-pointer text-1"
                                                               aria-hidden="true"></i>
                                                        </button>
                                                    </div>
                                                </a>

                                                <div id={"pencil_" + item.id} className="btn-group mr-2"
                                                     onClick={e => this.editRow(item)}>
                                                    <button type="button"
                                                            className="edit-btn border border-dark rounded-circle position-relative  mr-1 bg-white"
                                                            style={{"height": "27px", "width": "27px"}}>
                                                        <i className="fa fa-pencil xy-align cursor-pointer text-1"
                                                           aria-hidden="true"></i>
                                                    </button>
                                                </div>

                                                <div className="btn-group"
                                                     onClick={(e) => this.handleOpenModal(e, item.id)}>
                                                    <button type="button"
                                                            className="border border-dark rounded-circle position-relative  mr-1 bg-white"
                                                            style={{"height": "27px", "width": "27px"}}>
                                                        <i className="fa fa-trash xy-align cursor-pointer text-1 "
                                                           aria-hidden="true"></i>
                                                    </button>
                                                </div>

                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            );
                        })
                        }
                    </Accordion>
                </div>
            )

        } else {
            return (
                <div> No data</div>
            )
        }
    }

    // We delete the row and pass arg to isRowDeleted function
    deleteRow(id) {
        let that = this;
        this.db.collection(`sheets`).doc(id).delete().then(function () {
            that.setState({
                deleted: true,
                show: false,
                rowDeleteId: ''
            },() => {
                // After we delete the row we pass arg = true , we do that to refresh the page
                that.props.isRowDeleted(true);
            });

        })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });

    }

    // We pass the row which want to edit
    editRow(row) {
        if (row) {
            this.props.isRowEdit(row);
            $('.list-wrapper').addClass('d-none');
            //$("#pencil_"+row.id).addClass('d-none');
            //$("#times_"+row.id).removeClass('d-none');
            this.setState({isEditView: true})
        }
    }


    readMore(e, key, btnText) {
        if (key) {
            if (btnText === 'read-more') {
                $('#limit-text-id_' + key['listKey']).removeClass('limit-text');
                $('.read-more-text_' + key['listKey']).addClass('d-none');
                $('.less-text_' + key['listKey']).removeClass('d-none');
            } else {
                $('.less-text_' + key['listKey']).addClass('d-none');
                $('.read-more-text_' + key['listKey']).removeClass('d-none');
                $('#limit-text-id_' + key['listKey']).addClass('limit-text');
            }
        }
    }


    handleOpenModal = (e, id) => {
        let that = this;
        if (id) {
            this.setState({
                show: true,
                rowDeleteId: id
            });
        }
    };

    handleClose = () => {
        this.setState({
            show: false,
            rowDeleteId: ''
        });
    };

    loadModal = () => {
      return(
        <ModalMessage show={this.state.show} handleClose={this.handleClose} deleteRow={this.deleteRow}
                      rowId={this.state.rowDeleteId}/>
      )
    };

    render() {
        /* this.props.lists.push({
              'id': 1,
              'code': 'nnn nnn nnnnnnn nnnnn nnnnnnnn nnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn BBBB',
              'language': 'angular',
              'link': 'mako',
              'name': 'nnnnnn',
              'userId': '108673037216498992539'
          });*/
        return (
            <div>
                {this.showLists()}
                {this.state.show ? this.loadModal() : ''}
            </div>
        );
    }
}

export default SheetLists;
