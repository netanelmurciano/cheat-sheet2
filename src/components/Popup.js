import React, {Component} from 'react';
import firebase from '../firebase';
import $ from 'jquery'
import {Accordion, Button, Card, Form} from 'react-bootstrap';
import SheetLists from "./SheetLists";
import Autocomplete from "./common/Autocomplete";


class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sheets: [],
            languages: [],
            language: '',
            name: '',
            code: '',
            link: '',
            sheetId: '',
            isEditView: false,
        };

        this.db = firebase.firestore();

        this.handleAddSheet = this.handleAddSheet.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isRowDeleted = this.isRowDeleted.bind(this);
        this.isRowEdit = this.isRowEdit.bind(this);
        this.isRowCancel = this.isRowCancel.bind(this);
        this.selectedLanguage = this.selectedLanguage.bind(this);


    }

    componentDidMount() {
        let that = this;
        // Get all sheets data from firebase
        this.db.collection("sheets").get()
            .then((response) => {
                response.forEach((doc) => {
                    if(doc.data().data.userId === that.props.userId) {
                        let sheets = doc.data().data;
                        sheets['id'] = doc.id;
                        that.setState({sheets: [...that.state.sheets, sheets]});
                    }

                });
            })
            .catch(function (error) {
                console.error(error);
            });
        // Get all languages data from firebase
        this.db.collection("languages").get()
            .then((langsResponse) => {
                langsResponse.forEach((doc) => {
                        let languages = doc.data();
                        languages['id'] = doc.id;
                        that.setState({languages: [...that.state.languages, languages]});
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    // Catch form values
    handleAddSheet(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    selectedLanguage(languageSelected) {
        console.log('natannn')
        console.log(languageSelected)
        if(languageSelected) {
            this.setState({language:languageSelected})
        }
    }

    // Handle form submit
    // onSubmit we insert data to firebase
    handleSubmit(e, btnText) {
        let that = this;
        e.preventDefault();
        e.target.reset();
        // If btnText is false we Add new data
        if(!btnText && !this.state.sheetId) {
            document.getElementById("sheet-form").reset();
        let data = {
            'userId': this.props.userId,
            'language': this.state.language,
            'name': this.state.name,
            'code': this.state.code,
            'link': this.state.link,
        };
            this.db.collection("sheets").add({
            data
        })
            .then(function (response) {
                if (response.id) {
                    // Clean state before calling
                    that.setState({sheets: []});
                    that.componentDidMount()
                    $('.form-collapse').removeClass('show');
                }
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
        } else {
            // If btnText is true we Edit the data
            let data = {
                'userId': this.props.userId,
                'language': this.state.language,
                'name': this.state.name,
                'code': this.state.code,
                'link': this.state.link,
            };
            this.db.collection('sheets').doc(this.state.sheetId)
           .set({
               data
            }).then((docRef) => {
                that.setState({sheets: []});
                that.componentDidMount()
                $('.form-collapse').removeClass('show');
            })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        }
    }


    isRowDeleted(item) {
        if(item) {
            // Clean state before calling
            this.setState({sheets: []});
            this.componentDidMount();
        }
    }

    isRowEdit(row) {
        if(row) {
            $('.form-collapse').addClass('show');
            this.setState({isEditView: true});
            this.setState({name: row.name});
            this.setState({code: row.code});
            this.setState({link: row.link});
            this.setState({language: row.language});
            this.setState({sheetId: row.id});
        }
    }

    // If we canceled the edit
    isRowCancel(row) {
        if(row === 'cancel') {
            $('.form-collapse').removeClass('show');
            this.setState({isEditView: false});
            this.setState({fields: []});
            this.setState({sheetId: ''});
        }
    }


    render() {
        return (
            <div className="col-12">
                <div className="mx-auto">
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Card.Header} variant="link" eventKey='form-collapse'>
                                    <span className="text-info">To add a new sheet...</span>
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey='form-collapse' className="form-collapse">
                                <Card.Body>
                                        <Form onSubmit={(e) => this.handleSubmit(e, this.state.isEditView)} id="sheet-form" ref="form">
                                            {/* Language */}
                                            <Form.Group>
                                                <Form.Label>Language</Form.Label>
                                                <Autocomplete languages={this.state.languages} selectedLanguage={this.selectedLanguage}/>
                                            </Form.Group>
                                            {/* Name */}
                                            <Form.Group>
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="name" name="name" value={this.state.name} placeholder="Enter name"
                                                              onChange={e => this.handleAddSheet(e)}/>
                                                <Form.Text className="text-muted">
                                                </Form.Text>
                                            </Form.Group>

                                            {/* Code */}
                                            <Form.Group>
                                                <Form.Label>Code</Form.Label>
                                                <textarea rows="4" name="code" value={this.state.code} className="w-100" onChange={e => this.handleAddSheet(e)}/>
                                            </Form.Group>

                                            {/* Link */}
                                            <Form.Group>
                                                <Form.Label>Link</Form.Label>
                                                <Form.Control type="text" name="link"  value={this.state.link} onChange={e => this.handleAddSheet(e)}/>
                                            </Form.Group>
                                            <Button variant="primary" type="submit"  disabled={!this.state.name || !this.state.code}>
                                                {this.state.isEditView ? 'Edit' : 'Add'}
                                            </Button>
                                        </Form>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
                <div className="row mt-3">
                    <div className="col-12 mx-auto">
                        <SheetLists lists={this.state.sheets} isRowDeleted={this.isRowDeleted} isRowEdit={this.isRowEdit} isRowCancel={this.isRowCancel}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup;