import React,{useState} from 'react';
import {Segment,Header,Icon,Input,Image,Modal,Button,Menu} from 'semantic-ui-react'
import fire from '../../../config/firebase'
import './MessageHeader.css'

const MessageHeader = (props) =>{

    const channelsRef = fire.database().ref("channels");
    let usersRef = fire.database().ref('users');
    let members = JSON.parse(window.sessionStorage.getItem("channelMembers"))


    const [modalOpen,setModalOpen] = useState(false)
    const [userModal,setUserModal] = useState(false)

    const openModal = () => {
        setModalOpen(true);
        console.log(props.userID);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const openUserModal = () => {
        setUserModal(true);
    }

    const closeUserModal = () => {
        setUserModal(false);
    }

    const displayUsers = () => {
        let list = [];
        usersRef.on('value',snap=>{
            snap.forEach(function(childSnapshot) {
               if(members.includes(childSnapshot.key)){
                    list.push(childSnapshot.val());
                }
            });
        })

        return (
            <div>
                {list.map((item, index) => (
                    <div class="member">
                        <Image src={item.photoURL}/>
                        <p>{item.displayName}</p>
                    </div>
                ))}
            </div>
        );
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
                {!props.isPrivateChat && <Header.Subheader className="userCount" onClick={openUserModal}>{members?.length} User{props.uniqueUsers === 1 ? "" : "s"}</Header.Subheader>}
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

        <Modal data-aos="zoom-in" open={modalOpen} onClose={closeModal} className="userModal">
            <Modal.Content className="userInfoModal">
                <Image src={props.userPhoto}/>
                <p>{props.channelName}</p>
                <p className="userBio">About Me</p>
                <textarea value={props.userID}></textarea>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeModal} className="modalButton">
                    <Icon name="remove" />Close
                </Button>
            </Modal.Actions>
        </Modal>

        <Modal data-aos="zoom-in" open={userModal} onClose={closeUserModal} className="userModal">
            <Modal.Header>Users</Modal.Header>
            <Modal.Content className="userList">
                {displayUsers()}
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={closeUserModal} className="modalButton">
                    <Icon name="remove" />Close
                </Button>
            </Modal.Actions>
        </Modal>
    </Segment>
    </div>
}

export default MessageHeader;