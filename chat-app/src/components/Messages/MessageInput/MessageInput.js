import React, {useState, createRef} from 'react';
import {Segment,Header,Icon,Input,Button} from 'semantic-ui-react'
import './MessageInput.css'
import fire from '../../../config/firebase'
import firebase from 'firebase'
import {connect} from 'react-redux'
import FileUpload from '../FileUpload/FileUpload'
import {v4 as uuidv4} from 'uuid'
import Picker from 'emoji-picker-react';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

const MessageInput = (props) =>{

    const messagesRef = fire.database().ref("messages");
    const storageRef = fire.storage().ref();

    const [showEmojis,setShowEmojis] = useState(false);
    const [message,setMessage] = useState("")
    const [fileDialog,setFileDialog] = useState(false)

    const createMessageInfo = (downloadUrl) =>{
        return{
            user : {
                avatar : props.user.photoURL,
                name : props.user.displayName,
                id : props.user.uid
            },
            content : message,
            image : downloadUrl || "", 
            timestamp : firebase.database.ServerValue.TIMESTAMP
        }
    }

    
    const sendMessage = (downloadUrl) =>{
        if(downloadUrl){
            messagesRef.child(props.channel.id)
            .push().set(createMessageInfo(downloadUrl))
            .then(() => setMessage(""))
            .catch((err) => console.log(err))
        }
    }

    const sendText = () => {
        if(message){
            messagesRef.child(props.channel.id)
            .push().set(createMessageInfo())
            .then(() => setMessage(""))
            .catch((err) => console.log(err))
        }
    }

    const MessageChange = (e) => {
        const target = e.target
        setMessage(target.value)
    }

    const actionButtons = () =>{
        return <>
        <div className="InputButton">
            <Button icon="send"
            onClick={sendText}/>
            <Button icon="upload" onClick={() => setFileDialog(true)}/>
        </div>
        </>
    }

    const handleKeypress = e => {
      if (e.which === 13) {
        sendText();
      }
    };

    const uploadImage = (file,type) => {
        const filePath = `chat/images/${uuidv4()}.jpg`
        storageRef.child(filePath).put(file,{type : type})
        .then((data) => {
            data.ref.getDownloadURL()
            .then((url)=> sendMessage(url))
        })
        .catch((err)=> console.log(err))
    }

    const handleShowEmojis = () => {
        if(!showEmojis){
            setShowEmojis(true);
        }
        else{
            setShowEmojis(false);
        }
    }

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji)
    };

    return <Segment className="InputSegment">
        <div className="emoji-toggler">
            <Button onClick={handleShowEmojis}><InsertEmoticonIcon className="emoji"/></Button>
        </div>
        <div className="emoji-box">
            {showEmojis && <Picker onEmojiClick={onEmojiClick} />}
        </div>
        <Input
        onChange={MessageChange}
        name="message"
        value={message}
        label={actionButtons()}
        labelPosition="right"
        fluid="true"
        onKeyPress={handleKeypress}></Input>
        <FileUpload uploadImage={uploadImage} open={fileDialog} onClose={() => setFileDialog(false)}/>
    </Segment>
}

const mapStateToProps = (state) =>{
    return{
        user : state.user.currentUser,
        channel : state.channel.currentChannel
    }
}

export default connect(mapStateToProps)(MessageInput);