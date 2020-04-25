import React, {Component} from 'react';
import {Accordion, Card} from 'react-bootstrap';

const Toggle = () => {
    return (
        <Accordion.Toggle as={Card.Header} variant="link" eventKey='form-collapse'>
            <span className="text-info">To add a new sheet...</span>
        </Accordion.Toggle>
    );
};

export default Toggle;