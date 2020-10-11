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
            userInput: '',
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
                this.setState({
                    link: tabs[0].url,
                    name: tabs[0].title
                });
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
            'timestamp':firebase.firestore.FieldValue.serverTimestamp()
        };
        // If btnText is false we Add new data
        if(!btnText && !this.state.sheetId) {
            this.db.collection("sheets").add({
            data
        })
            .then(function (response) {
                if (response.id) {
                    that.props.loadNotify('success', 'Row have been added');
                    // Clean state before calling
                    that.setState({
                        sheets: []
                    });
                    // Close form
                    $('.form-collapse').removeClass('show');
                    // Change icon from minus to plus
                    $('.circle-plus').toggleClass('opened');
                    // Show list
                    $('.list-wrapper').removeClass('d-none');
                    // Show box search
                    $('.card-header').removeClass('d-none');
                }
                that.componentDidMount();
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
                that.setState({
                    sheets: [],
                    isEditView: false,
                    userInput: '',
                    filteredSuggestions:[]
                });

                that.props.loadNotify('success', 'Row have been updated');

                // Close form
                $('.form-collapse').removeClass('show');
                // Change icon from minus to plus
                $('.circle-plus').toggleClass('opened');
                // Show list
                $('.list-wrapper').removeClass('d-none');
                // Show box search
                $('.card-header').removeClass('d-none');

                that.componentDidMount()
            })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
        }
    }

    isRowDeleted(item) {
        if(item) {
            // Clean state before data load
            this.setState(
                {
                    sheets: [],
                    filteredSuggestions: [],
                    userInput: ''
                });

            this.props.loadNotify('success', 'Row have been deleted');
            this.componentDidMount();
        }
    }

    isRowEdit(row) {
        if(row) {
            $('.form-collapse').addClass('show');
            $('.circle-plus').toggleClass('opened');
            this.setState(
                {
                    isEditView: true,
                    name: row.name,
                    code: row.code,
                    link: row.link,
                    language: row.language,
                    sheetId: row.id

                });
        }
    }

    // If we canceled the edit
    isRowCancel(e) {
        $('.form-collapse').removeClass('show');
        $('.circle-plus').toggleClass('opened');
        $('.card-header').removeClass('d-none');
        $('.list-wrapper').removeClass('d-none');
        this.setState({
            isEditView: false,
            //fields: [],
            //sheetId: ''
        });
    }

    // Handle input text changed
    onChange(e) {
        let userInput = e.target.value;
        // we filter our suggestions list according of what we type in input
        const filteredSuggestions =  this.state.sheets.filter(
            (suggestion) => suggestion.language.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > -1
            || suggestion.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > -1
        );
        this.setState({
            filteredSuggestions,
            userInput,
        });
    }

    handleNewLanguageMessage = (row) => {
        if(row) {
            this.props.loadNotify('success', 'New language have been added');
            this.componentDidMount();
        }
    };

    render() {
        return (
            <div className="col-12 mb-3">
                <div className="mx-auto">
                    <Accordion>
                        <Card>
                            <Card.Header className="card-header d-none">
                                <Accordion.Toggle as={Card.Header} >
                                    <React.Fragment>
                                        <Form.Control
                                            type="text"
                                            onChange={(e) => this.onChange(e)}
                                            value={this.state.userInput}
                                            placeholder="Search tag..."
                                        />
                                    </React.Fragment>
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey='form-collapse' className="form-collapse show mb-3">
                                <Card.Body>
                                        <Form onSubmit={(e) => this.handleSubmit(e, this.state.isEditView)} id="sheet-form" ref="form" className="d-inline">
                                            {/* Language */}
                                            <Form.Group>
                                                <Form.Label>Language</Form.Label>
                                                <Autocomplete suggestions={this.state.languages} selectedSuggestion={this.selectedLanguage} currentLanguage={this.state.language}  handleNewLanguageMessage={this.handleNewLanguageMessage}  />
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
                                            <Button variant="success" type="submit"  disabled={!this.state.name || !this.state.code || !this.state.language}>
                                                {this.state.isEditView ? 'Edit' : 'Add'}
                                            </Button>
                                        </Form>
                                        <Button variant="danger" type="text" onClick={(e) => this.isRowCancel(e)}  className='mx-2 d-inline'>
                                            Cancel
                                        </Button>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
                <div className="row mt-3 list-wrapper d-none">
                    <div className="col-12 mx-auto">
                        <SheetLists lists={this.state.filteredSuggestions.length > 0 ? this.state.filteredSuggestions : this.state.sheets} isRowDeleted={this.isRowDeleted} isRowEdit={this.isRowEdit} isRowCancel={this.isRowCancel}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup;
