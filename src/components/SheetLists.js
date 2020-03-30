import React, {Component} from 'react';
import {Accordion, Card, Button} from 'react-bootstrap'

class SheetLists extends Component {
    render() {
        console.log(this.props);
        return (
            <div>
               {
                    this.props.lists.length > 0?
                        this.props.lists.map((item, key) =>
                            <div key={key} className="border-bottom">
                                <Accordion>
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Card.Header} variant="link" eventKey={key}>
                                                {item.name} ({item.language})
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={key}>
                                            <Card.Body>
                                                <div>{item.code}</div>
                                                <div>{item.link}</div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </div>

                        )
                        :
                        <div> No data</div>
                }
            </div>
        );
    }
}

export default SheetLists;