import React, {Component} from 'react';
import firebase from '../firebase';
import {Button, Form} from 'react-bootstrap';
import SheetLists from "./SheetLists";


class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sheets: [],
            language: 'react',
            name: '',
            code: '',
            link: '',
            isEditView: false,
        };

        this.handleAddSheet = this.handleAddSheet.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isRowDeleted = this.isRowDeleted.bind(this);
        this.isRowEdit = this.isRowEdit.bind(this);
        this.isRowCancel = this.isRowCancel.bind(this);

    }

    componentDidMount() {
        let that = this;
        let db = firebase.firestore();
        db.collection("sheets").get()
            .then(function (response) {
                response.forEach((doc) => {
                    let sheets = doc.data().data;
                    sheets['id'] = doc.id;
                    that.setState({sheets: [...that.state.sheets, sheets]});
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

    // Catch form language
    handleChangeLanguage(e) {
        if (e.target.value) {
            this.setState({language: e.target.value})
        }
    }

    // Handle form submit
    // onSubmit we insert data to firebase
    handleSubmit(e) {

        let that = this;
        e.preventDefault();
        e.target.reset();
        let data = {
            'language': this.state.language,
            'name': this.state.name,
            'code': this.state.code,
            'link': this.state.link,
        };

        let db = firebase.firestore();
        db.collection("sheets").add({
            data
        })
            .then(function (response) {
                if (response.id) {
                    // Clean state before calling
                    that.setState({sheets: []});
                    that.componentDidMount()
                }
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
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
            this.setState({isEditView: true});
            this.setState({name: row.name});
            this.setState({code: row.code});
            this.setState({link: row.link});
            this.setState({language: row.language});
        }
    }

    isRowCancel(row) {
        if(row === 'cancel') {
            this.setState({name: ''});
            this.setState({code: ''});
            this.setState({link: ''});
            this.setState({language: 'react'});
        }
    }

    render() {
        return (
            <div className="col-12">
                <div className="mx-auto">
                    <Form onSubmit={this.handleSubmit} id="sheet-form">
                        {/* Language */}
                        <Form.Group>
                            <Form.Label>Language</Form.Label>
                            <select className="form-control" onChange={e => this.handleChangeLanguage(e)}>
                                <option name='language' value='react' selected={this.state.language === 'react'} >React</option>
                                <option name='language' value='vue' selected={this.state.language === 'vue'}>Vue</option>
                                <option name='language' value='php' selected={this.state.language === 'php'}>Php</option>
                                <option name='language' value='git' selected={this.state.language === 'git'}>Git</option>
                                <option name='language' value='ubuntu' selected={this.state.language === 'ubuntu'}>Ubuntu</option>
                            </select>
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