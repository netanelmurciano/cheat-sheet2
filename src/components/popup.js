import React, {Component} from 'react';
import firebase from '../firebase';
import {Button, Form} from 'react-bootstrap';


class Popup extends Component {
    constructor() {
        super();
        this.state = {
            sheets: [],
            language: '',
            name: '',
            code: '',
            link: '',

        };
        this.handleAddSheet = this.handleAddSheet.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        let that = this;
        let db = firebase.firestore();
        db.collection("sheets").get()
            .then(function(response) {
                response.forEach((doc) => {
                    let sheets = doc.data().data;
                    that.setState({sheets:[...that.state.sheets, sheets]});
                });
            })
            .catch(function(error) {
                console.error(error);
            });


    }

    // Catch form values
    handleAddSheet(e) {
        this.setState({[e.target.name] : e.target.value});
    }

    // Catch form language
    handleChangeLanguage(e) {
        if(e.target.value) {
            this.setState({language: e.target.value})
        }
    }
    // Handle form submit
    // onSubmit we insert data to firebase
    handleSubmit(e) {
        e.preventDefault();
        e.target.reset();
        let data = {
            'language': this.state.language,
            'name': this.state.name,
            'code': this.state.code,
            'link': this.state.link,
        };

        let db = firebase.firestore();
        db.collection("sheets").add({data
        })
            .then(function(response) {
                if(response.id) {
                    console.log('success');
                }
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    }



    render() {
        //console.log(this.state);
        return (
            <div className="row d-flex">
                <div className="col-12 col-md-6 mx-auto">
                    <Form onSubmit={this.handleSubmit} id="sheet-form">
                        {/* Language */}
                        <Form.Group>
                            <Form.Label>Language</Form.Label>
                            <select className="form-control" onChange={e => this.handleChangeLanguage(e)}>
                                <option name='language' value='react'>React</option>
                                <option name='language' value='vue'>Vue</option>
                                <option name='language' value='php'>Php</option>
                                <option name='language' value='git'>Git</option>
                                <option name='language' value='ubuntu'>Ubuntu</option>
                            </select>
                        </Form.Group>

                        {/* Sheet Name */}
                        <Form.Group>
                            <Form.Label>Sheet Name</Form.Label>
                            <Form.Control type="name" name="name" placeholder="Enter name" onChange={e => this.handleAddSheet(e)}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>

                        {/* Sheet Name */}
                        <Form.Group>
                            <Form.Label>Sheet Code</Form.Label>
                            <textarea rows="4" name="code" className="w-100" onChange={e => this.handleAddSheet(e)}/>
                        </Form.Group>

                        {/* Sheet Link */}
                        <Form.Group>
                            <Form.Label>Sheet Link</Form.Label>
                            <Form.Control type="text" name="link" onChange={e => this.handleAddSheet(e)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add
                        </Button>
                    </Form>
                </div>

                <div className="col-12 col-md-6 mx-auto">
                    {
                        this.state.sheets ?
                            this.state.sheets.map((item, key) =>
                                <div key={key} className="border-bottom">
                                    <div> {item.name} ({item.code})</div>
                                    <div> {item.code}</div>
                                    <div> {item.link}</div>
                                </div>

                            )
                            :
                            <div> No data</div>
                    }
                </div>
            </div>
        );
    }
}

export default Popup;