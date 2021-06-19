import React,{useState} from 'react';
import {Segment,Header,Icon,Input,Image,Modal,Button} from 'semantic-ui-react'
import './MessageHeader.css'

const MessageHeader = (props) =>{

    const [modalOpen,setModalOpen] = useState(false)

    const openModal = () => {
        setModalOpen(true);
        console.log(props.userID);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    return <div className="msgHeader">
    <Segment>
        <Header floated="left" fluid="true" as="h2">
            <span>
                <div onClick={openModal} className="chatInfo">
                    {props.isPrivateChat && <Image className="userAvatar" src={props.userPhoto} />}
                    {props.isPrivateChat && <div className="userName">{props.channelName}</div>}
                </div>
                <div className="channelName">{!props.isPrivateChat && "# " + props.channelName}</div>
                {!props.isPrivateChat && <Icon className="favoriteButton" onClick={props.favoriteChannel} 
                name={props.favorite ? "star" : "star outline"}
                color={props.favorite ? "yellow" : "black"}/>}
                {!props.isPrivateChat && <div className="description">{props.channelDescripiton}</div>}
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
        <Modal data-aos="zoom-in" open={modalOpen} onClose={closeModal} className="channelModal">
            <Modal.Content className="userInfoModal">
                <Image src={props.userPhoto}/>
                <p>{props.channelName}</p>
                <p>Bio</p>
                <textarea value={props.userID}></textarea>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeModal} className="modalButton">
                    <Icon name="remove" />Close
                </Button>
            </Modal.Actions>
        </Modal>
    </Segment>
    </div>
}

export default MessageHeader;