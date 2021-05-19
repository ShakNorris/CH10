import React, {useEffect,useState} from 'react';
import MessageContent from './MessageContent/MessageContent'
import MessageHeader from './MessageHeader/MessageHeader'
import MessageInput from './MessageInput/MessageInput'
import {connect} from 'react-redux'
import fire from '../../config/firebase'
import {Segment,Comment} from 'semantic-ui-react'
import './Messages.css'

const Messages = (props) => {

    const messagesRef = fire.database().ref("messages")
    const [messages,setMessages] = useState([])
    console.log(props.channel)

    useEffect(()=>{
        if(props.channel){
            setMessages([])
            messagesRef.child(props.channel.id).on('child_added',snap=>{
                setMessages((currentState)=>{
                    let updatedState = [...currentState]
                    updatedState.push(snap.val())
                    return updatedState
                })
            })
            return () => messagesRef.child(props.channel.id).off();
        }
    },[props.channel])

    const displayMessages = () =>{
        if(messages.length > 0){
            return messages.map((message) =>{
                return <MessageContent key={message.timestamp} message={message} />
            })
        }
    }

    return <div class="Messages">
        <MessageHeader/>
    <Segment class="messageContent">
        <Comment.Group>
            {displayMessages()}
        </Comment.Group>
    </Segment>
    <MessageInput/>
    </div>
}

const mapStateToProps = (state) => {
    return{
        channel: state.channel.currentChannel,
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(Messages);