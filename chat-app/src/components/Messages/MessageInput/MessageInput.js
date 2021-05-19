import React, {useState} from 'react';
import {Segment,Header,Icon,Input,Button} from 'semantic-ui-react'
import './MessageInput.css'
import fire from '../../../config/firebase'
import firebase from 'firebase'
import {connect} from 'react-redux'
import FileUpload from '../FileUpload/FileUpload'
import {v4 as uuidv4} from 'uuid'

const MessageInput = (props) =>{

    const messagesRef = fire.database().ref("messages");
    const storageRef = fire.storage().ref();

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
        if(message || downloadUrl){
            messagesRef.child(props.channel.id)
            .push().set(createMessageInfo(downloadUrl))
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
            <Button icon="send" onClick={sendMessage()}/>
            <Button icon="upload" onClick={() => setFileDialog(true)}/>
        </div>
        </>
    }

    const uploadImage = (file,type) => {
        const filePath = `chat/images/${uuidv4()}.jpg`
        storageRef.child(filePath).put(file,{type : type})
        .then((data) => {
            data.ref.getDownloadURL()
            .then((url)=> sendMessage(url))
        })
        .catch((err)=> console.log(err))
    }

    return <Segment className="InputSegment">
        <Input
        onChange={MessageChange}
        name="message"
        value={message}
        label={actionButtons()}
        labelPosition="right"
        fluid="true"/>
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