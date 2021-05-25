import React,{useState,useEffect} from 'react';
import {Comment, CommentAuthor, CommentContent, Image, Modal,Button,Input,Icon} from 'semantic-ui-react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import './MessageContent.css'
import AOS from "aos";
import "aos/dist/aos.css";

TimeAgo.locale(en)

const timeAgo = new TimeAgo()

const MessageContent = (props) =>{

    useEffect(() => {
        AOS.init();
        AOS.refresh();
    });

    const [imageModal,setImageModal] = useState(false)

    const openModal = () => {
        setImageModal(true);
    }

    const closeModal = () => {
        setImageModal(false);
    }

    return <div className="messageContent">
        <Comment>
        <Comment.Avatar src={props.message.user.avatar}/>
        <Comment.Content>
            <div className="topContent">
                <Comment.Author>{props.message.user.name}</Comment.Author>
                <Comment.Metadata class="time">{timeAgo.format(props.message.timestamp)}</Comment.Metadata>
            </div>
            <div className="sentContent">
                {props.message.image ? <Image onClick={openModal} onLoad={props.imageLoaded} src={props.message.image} /> :
                <Comment.Text>{props.message.content}</Comment.Text>}
            </div>
        </Comment.Content>
        </Comment>
        <Modal basic open={imageModal} onClose={closeModal} className="imageModal">
            <Modal.Actions className="imageButton">
                <Button onClick={closeModal}>
                    <Icon name="remove" />
                </Button>
            </Modal.Actions>
            <div data-aos="zoom-in">
                <Modal.Content className="imageContent">
                    <Image src={props.message.image} />
                </Modal.Content>
            </div>
        </Modal>
    </div>
}

export default MessageContent;