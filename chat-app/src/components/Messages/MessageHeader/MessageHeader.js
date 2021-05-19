import React from 'react';
import {Segment,Header,Icon,Input} from 'semantic-ui-react'
import './MessageHeader.css'

const MessageHeader = () =>{
    return <div className="msgHeader">
    <Segment>
        <Header floated="left" fluid="true" as="h2">
            <span>
                Channel
            <Icon name="star outline"/>
            </span>
            <Header.Subheader>3 Users</Header.Subheader>
        </Header>
        <Header floated="right">
            <Input
            name="search"
            icon="search"
            placeholder="Search"
            size="mini">
            </Input>
        </Header>
    </Segment>
    </div>
}

export default MessageHeader;