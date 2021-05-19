import React from 'react';
import {Comment, CommentAuthor, CommentContent, Image} from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import './MessageContent.css'


TimeAgo.locale(en)

const timeAgo = new TimeAgo()

const MessageContent = (props) =>{
    return <div className="messageContent">
        <Comment>
        <Comment.Avatar src={props.message.user.avatar}/>
        <Comment.Content>
            <div className="topContent">
                <Comment.Author>{props.message.user.name}</Comment.Author>
                <Comment.Metadata class="time">{timeAgo.format(props.message.timestamp)}</Comment.Metadata>
            </div>
            <div className="sentContent">
                {props.message.image ? <Image src={props.message.image} /> :
                <Comment.Text>{props.message.content}</Comment.Text>}
            </div>
        </Comment.Content>
        </Comment>
    </div>
}

export default MessageContent;