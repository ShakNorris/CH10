import React, {useEffect,useState,useRef} from 'react';
import MessageContent from './MessageContent/MessageContent'
import MessageHeader from './MessageHeader/MessageHeader'
import MessageInput from './MessageInput/MessageInput'
import {connect} from 'react-redux'
import fire from '../../config/firebase'
import {Segment,Comment} from 'semantic-ui-react'
import {addFavoriteChannel,removeFavoriteChannel} from '../../store/actions'
import './Messages.css'

const Messages = (props) => {

    const messagesRef = fire.database().ref("messages")
    const usersRef = fire.database().ref("users")
    const [messages,setMessages] = useState([])
    const [searchTermState,setSearchTermState] = useState("")
    let divRef = useRef()

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

    useEffect(()=>{
        if(props.user){
            usersRef.child(props.user.uid).child("favorite").on('child_added',snap=>{
                props.addFavoriteChannel(snap.val());
            })
            usersRef.child(props.user.uid).child("favorite").on('child_removed',snap=>{
                props.removeFavoriteChannel(snap.val());
            })
            return () => usersRef.child(props.user.uid).child("favorite").off();
        }
    },[props.user])

    useEffect(() => {
        divRef.scrollIntoView({behavior : "smooth"});
    },[messages])

    const imageLoaded = () =>{
        divRef.scrollIntoView({behavior : "smooth"});
    }

    const displayMessages = () =>{
        let displayMessages = searchTermState ? filterMessage() :  messages
        if(displayMessages.length > 0){
            return displayMessages.map((message) =>{
                return <MessageContent imageLoaded={imageLoaded} key={message.timestamp} message={message} />
            })
        }
    }
    
    const uniqueUsersCount = () => {
        const uniqueUsers = messages.reduce((acc,message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name)
            }
            return acc;
        },[])

        return uniqueUsers.length;
    }

    const searchTermChange = (e) =>{
        let target = e.target
        setSearchTermState(target.value)
    }

    const filterMessage = () => {
        const regex = new RegExp(searchTermState,"gi")
        const filteredMessages = messages.reduce((acc,message)=>{
            if((message.content && message.content.match(regex)) || message.user.name.match(regex)){
                acc.push(message);
            }
            return acc;
        },[])
        return filteredMessages;
    }

    const favoriteChannel = () => {
        let favoriteRef = usersRef.child(props.user.uid).child("favorite").child(props.channel.id);
        if(isFavorite()){
            favoriteRef.remove();
        }else{
            favoriteRef.set({channelId : props.channel.id, channelName : props.channel.name})
        }
    }

    const isFavorite = () => {
        return Object.keys(props.favoriteChannels).includes(props.channel?.id);
    }

    return <div class="Messages">
        <MessageHeader 
        favoriteChannel={favoriteChannel}
        favorite={isFavorite()}
        isPrivateChat={props.channel?.isPrivateChat} 
        searchTermChange={searchTermChange} 
        channelName={props.channel?.name}
        userPhoto={props.channel?.photoURL}
        userID = {props.channel?.bio} 
        channelDescripiton = {props.channel?.description}
        uniqueUsers={uniqueUsersCount()}/>
    <Segment class="messageContent">
        <Comment.Group>
            {displayMessages()}
            <div ref={currentEl => divRef = currentEl}></div>
        </Comment.Group>
    </Segment>
    <MessageInput/>
    </div>
}

const mapStateToProps = (state) => {
    return{
        channel: state.channel.currentChannel,
        user: state.user.currentUser,
        favoriteChannels : state.favoriteChannel.favoriteChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addFavoriteChannel : (channel) => dispatch(addFavoriteChannel(channel)),
        removeFavoriteChannel : (channel) => dispatch(removeFavoriteChannel(channel)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);