import React from 'react';
import {Segment,Header,Icon,Input} from 'semantic-ui-react'
import './MessageHeader.css'

const MessageHeader = (props) =>{
    return <div className="msgHeader">
    <Segment>
        <Header floated="left" fluid="true" as="h2">
            <span>
                {(props.isPrivateChat ? "@ " : "# ") + props.channelName}
                {!props.isPrivateChat && <Icon className="favoriteButton" onClick={props.favoriteChannel} 
                name={props.favorite ? "star" : "star outline"}
                color={props.favorite ? "yellow" : "black"}/>}
                {!props.isPrivateChat && <Header.Subheader>{props.uniqueUsers} User{props.uniqueUsers === 1 ? "" : "s"}</Header.Subheader>}
            </span>
        </Header>
        <Header floated="right">
            <Input
            name="search"
            icon="search"
            placeholder="Search"
            size="mini"
            onChange={props.searchTermChange}>
            </Input>
        </Header>
    </Segment>
    </div>
}

export default MessageHeader;