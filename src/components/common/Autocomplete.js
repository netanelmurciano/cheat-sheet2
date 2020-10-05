import React, {Component} from 'react';
import firebase from '../../firebase';
import {Form} from 'react-bootstrap';
import SuggestionsListComponent from "./suggestionsListComponent";

class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: ''
        };
        this.db = firebase.firestore();
        this.setSelectedLanguage = this.setSelectedLanguage.bind(this);
    }

    // Handle input text changed
    onChange(e) {
        // we filter our suggestions list according of what we type in input
        const filteredSuggestions =  this.props.suggestions.filter(
            (suggestion) => suggestion.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > -1
        );
        this.setState({
            filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });
    }
    // We set the selected language according what we choose from the list
    // we handle the click in suggestionsLIstComponent
    setSelectedLanguage(e) {
        this.setState({
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        })
        this.props.selectedSuggestion(e.currentTarget.innerText)
    }

    // Add new language
    handleAddLanguage(e) {
        e.preventDefault();
        let that = this;
        this.db.collection("languages").add({
            'name': this.state.userInput
        })
            .then(function (response) {
                if (response.id) {
                    that.setState({userInput: ''});
                    alert('Language been added');
                    window.location.reload();
                }
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    render() {
        let suggestionsListComponent;
        if (this.state.showSuggestions && this.state.userInput) {
            if (this.state.filteredSuggestions.length) {
                /* If we find match */
                suggestionsListComponent = (
                  <SuggestionsListComponent filteredSuggestions={this.state.filteredSuggestions} handleSelectedLanguage={this.setSelectedLanguage}/>
                );
            } else {
                /* If we don't find match */
                suggestionsListComponent = (
                    <div className="no-suggestions">
                        <em>No suggestions! <span className="text-info cursor-pointer" onClick={(e) => this.handleAddLanguage(e)}>Click to add new language {this.state.userInput}</span></em>
                    </div>
                );
            }
        }
        return (
                <React.Fragment>
                    <Form.Control
                        type="text"
                        onChange={(e) => this.onChange(e)}
                        name='language'
                        value={this.state.userInput ? this.state.userInput : this.props.currentLanguage}
                    />
                    {suggestionsListComponent}
                </React.Fragment>
        );
    }
}

export default Autocomplete;
