import React, {Component} from 'react';

class SuggestionsListComponent extends Component {
    constructor(props) {
        super(props);
    }
    selectLanguage(e) {
        this.props.handleSelectedLanguage(e);
    }
    render() {
        return (
            <div>
                <ul className="suggestions">
                    {this.props.filteredSuggestions.map((language, index) => {
                        return (
                            <li key={language.id} onClick={(e) => this.selectLanguage(e)}>
                               <span>{language.name}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default SuggestionsListComponent;