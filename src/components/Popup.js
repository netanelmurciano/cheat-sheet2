/* global chrome */
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
            filteredSuggestions:[],
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

        // Get current tab url
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
            (tabs) => {
                this.setState({link: tabs[0].url});
                this.setState({name: tabs[0].title})
            }
        );
        // If we have copy of text in clipboard we add it to 'code' input
        if(document.execCommand('paste')) {
            let input = document.querySelector("textarea");
            input.focus();
            $('#code').innerText = document.execCommand('paste')
        }
    }

    // Set form values
    handleAddSheet(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    selectedLanguage(languageSelected) {
        if(languageSelected) {
            this.setState({language:languageSelected})
        }
    }

    // Handle form submit
    // onSubmit we insert data to firebase
    handleSubmit(e, btnText) {
        let that = this;
        e.preventDefault();

        let data = {
            'userId': this.props.userId,
            'language': this.state.language,
            'name': this.state.name,
            'code': this.state.code,
            'link': this.state.link,
        };
        // If btnText is false we Add new data
        if(!btnText && !this.state.sheetId) {
            this.db.collection("sheets").add({
            data
        })
            .then(function (response) {
                if (response.id) {
                    // Clean state before calling
                    that.setState({sheets: []});
                    that.componentDidMount();
                    // Close form
                    $('.form-collapse').removeClass('show');
                    // Change icon from minus to plus
                    $('.circle-plus').toggleClass('opened');
                }
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
        } else {
            // If btnText is true we Edit the data
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
            // Clean state before data load
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

    // Handle input text changed
    onChange(e) {
        // we filter our suggestions list according of what we type in input
        const filteredSuggestions =  this.state.sheets.filter(
            (suggestion) => suggestion.language.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > -1
        );
        this.setState({
            filteredSuggestions,
        });
    }

    render() {
        return (
            <div className="col-12">
                <div className="mx-auto">
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Card.Header} >
                                    <React.Fragment>
                                        <Form.Control
                                            type="text"
                                            onChange={(e) => this.onChange(e)}
                                            value={this.state.userInput}
                                            placeholder="Search language..."
                                        />
                                    </React.Fragment>
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey='form-collapse' className="form-collapse show">
                                <Card.Body>
                                        <Form onSubmit={(e) => this.handleSubmit(e, this.state.isEditView)} id="sheet-form" ref="form">
                                            {/* Language */}
                                            <Form.Group>
                                                <Form.Label>Language</Form.Label>
                                                <Autocomplete suggestions={this.state.languages} selectedSuggestion={this.selectedLanguage}/>
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
                                                <textarea  rows="4" name="code" id="code" value={this.state.code} className="w-100" onChange={e => this.handleAddSheet(e)} />
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
                        <SheetLists lists={this.state.filteredSuggestions.length > 0 ? this.state.filteredSuggestions : this.state.sheets} isRowDeleted={this.isRowDeleted} isRowEdit={this.isRowEdit} isRowCancel={this.isRowCancel}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup;