import React, {Component} from 'react';

class SuggestionsListComponent extends Component {
    selectSuggest(e) {
        this.props.handleSelectedLanguage(e);
    }
    render() {
        return (
                <ul className="suggestions">
                    {this.props.filteredSuggestions.map((suggest, index) => {
                        return (
                            <li key={suggest.id} onClick={(e) => this.selectSuggest(e)} className='cursor-pointer'>
                               <span>{suggest.name}</span>
                            </li>
                        );
                    })}
                </ul>
        );
    }
}

export default SuggestionsListComponent;
