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
    const acceptedVideoTypes = ["video/mp4","video/mov","video/avi"]
    const acceptedPhotoTypes = ["image/png","image/jpeg","image/jpg","image/gif"]

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
                {props.message.image && acceptedPhotoTypes.includes(props.message.fileType) && <Image onClick={openModal} onLoad={props.imageLoaded} src={props.message.image} />}
                {props.message.image && acceptedVideoTypes.includes(props.message.fileType) && 
                <video height="240">
                    <source src={props.message.image} type="video/mp4"></source>
                </video>
                }
                {props.message.image && !acceptedPhotoTypes.includes(props.message.fileType) && !acceptedVideoTypes.includes(props.message.fileType) &&
                <Comment.Text>
                    <a className="sentFile" href={props.message.image} target="_blank" download>
                        <Icon name="file alternate"/><span>{props.message.fileName}</span>
                    </a>
                </Comment.Text>
                }
                {!props.message.image && <Comment.Text>{props.message.content}</Comment.Text>}
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
                {props.message.image && acceptedPhotoTypes.includes(props.message.fileType) && <Image src={props.message.image} /> }
                </Modal.Content>
            </div>
        </Modal>
    </div>
}

export default MessageContent;