import React, {useState, useEffect, Fragment} from 'react'
import {connect} from 'react-redux'
import { Menu, Icon, Modal,Form, Button} from 'semantic-ui-react'
import fire from '../../../config/firebase'
import firebase from 'firebase'
import { setChannel } from '../../../store/actions'
import {Notifications} from '../Notifications/Notifications'
import './Channels.css'
import AOS from "aos";
import "aos/dist/aos.css";

const Channels = (props) => {
    const [modalOpen,setModalOpen] = useState(false)
    const [privateModalOpen,setPrivateModalOpen] = useState(false)
    const [addChannel,setAddChannel] = useState({name : '', description : '', password : ''})
    const [isLoading,setIsLoading] = useState(false)
    const [channelsState, setChannelsState] = useState([])
    const [currentChannel,setCurrentChannel] = useState({})
    const [channelPassword,setChannelPassword] = useState('');
    
    let member = {
        userName: props.user?.displayName,
        allowed : 1
    }

    const channelsRef = fire.database().ref("channels");
    const usersRef = fire.database().ref("users");

    useEffect(() => {
        channelsRef.on('child_added', (snap) => {
            setChannelsState((currentState) => {
                let updatedState = [...currentState];
                updatedState.push(snap.val());             
                return updatedState;
            })
        });
        return () => channelsRef.off();
    }, [])

    useEffect(()=>{
        if(channelsState.length > 0){
            props.selectChannel(channelsState[0])
            setCurrentChannel(channelsState[0])
        }
    },[!props.channel ? channelsState : null])

    useEffect(()=>{
        if(props.user){
            props.selectChannel(channelsState[0])
            setCurrentChannel(channelsState[0])
        }
    },[!props.channel ? channelsState : null])

    useEffect(() => {
        AOS.init();
        AOS.refresh();
    });

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const openPrivateModal = () => {
        setPrivateModalOpen(true);
    }

    const closePrivateModal = () => {
        setPrivateModalOpen(false);
    }

    const formValidation = () => {
        return addChannel && addChannel.name && addChannel.description
    }

    const handleInput = (e) => {
        let target = e.target
        setAddChannel((currentState) =>{
            let updatedState = {...currentState};
            updatedState[target.name] = target.value;
            return updatedState;
        })
    }

    const onSubmit = () => {
        if(!formValidation()){
            return;
        }

        const key = channelsRef.push().key;

        const channel = {
            id : key,
            name : addChannel.name,
            description : addChannel.description,
            password : addChannel.password,
            createdBy : {
                user: props.user.displayName,
                avatar : props.user.photoURL
            }
        }
        setIsLoading(true)
        channelsRef.child(key)
        .update(channel).then(()=>{
            setAddChannel({Name : '', Description : '', Password : ''});
            setIsLoading(false);
            closeModal();
        })
        .catch((err)=> {
            console.log(err);
        })
    }

    const displayChannels = () => {
        return channelsState.map((channel)=>{
            return <Menu.Item
            key={channel.key}
            name={channel.name}
            onClick={()=> {props.selectChannel(channel);checkCurrentCh(channel);checkPrivate(channel)}}
            active={props.channel && channel.id === props.channel.id && !props.channel.isFavorite}>
            {(channel.password ? <span onClick={openPrivateModal} className="privateChannel"><Icon className="privateChannelIcon" name="lock"/>{channel.name}</span> : "# " + channel.name)}
            <Notifications 
                user={props.user} 
                channel={props.channel} 
                channelNotification={channel.id}
            />
            </Menu.Item>
        })
    }

    const setLastVisited = (user,channel) => {
        const lastVisited = usersRef.child(user.uid).child("lastVisited").child(channel.id);
        lastVisited.set(firebase.database.ServerValue.TIMESTAMP)
        lastVisited.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP)
    }

    const checkCurrentCh = (channel) => {
        let userID = props.user?.uid;
        setCurrentChannel(channel);
        const ChannelMembers= channelsRef.child(channel.id).child("members").child(props.user.uid);

        ChannelMembers.on('value',snap=>{
            if(!snap.val()){
                if(channel.password && channel.createdBy.user != props.user.displayName)
                {
                    member.allowed = -1;
                }
                ChannelMembers.set(member);
            }
        })

        ValidateUser(channel)
    }

    if(currentChannel.members){
        window.sessionStorage.setItem("channelMembers",JSON.stringify(Object?.keys(currentChannel.members)));
    }

    const ValidateUser = (channel) =>{
        let Allowed = 0;
        const ChannelMembers= channelsRef.child(channel.id).child("members").child(props.user.uid);
        ChannelMembers.on('value',snap=>{
            Allowed = snap.val().allowed;
            console.log(snap.val().allowed);
        })
        if(channel.password){
            if(Allowed == 0){
                setCurrentChannel(channel);
                ChannelMembers.on('value',snap=>{
                    snap.ref.update({allowed: 0}); 
                })
            }
        }
        if(channel.password && channel.createdBy.user != props.user.displayName){
            if(Allowed != 0){
                openPrivateModal();
                selectChannel(channelsState[0])
            }
        }
    }

    const checkPrivate = (channel) => {
        let Allowed = 0;
        let ChannelMembers = channelsRef.child(channel.id).child("members").child(props.user.uid);
        ChannelMembers.on('value',snap=>{
            Allowed = snap.val().allowed;
        })
        if(channel.password && channel.createdBy.user != props.user.displayName){
            if(Allowed == -1){
                openPrivateModal();
                selectChannel(channelsState[0]);    
            }
        }
    }

    const handlePasswordInput = (e) => {
        let target = e.target
        setChannelPassword((currentState) =>{
            console.log(currentState)
            let updatedState = {...currentState};
            updatedState[target.name] = target.value;
            return updatedState;
        })
    }

    const JoinPrivate = () =>{
        console.log(channelPassword.password);
        console.log(currentChannel.password);
        if(channelPassword.password == currentChannel.password){
            selectChannel(currentChannel);
            setChannelPassword("");
            closePrivateModal();
        }
        channelsRef.child(currentChannel.id).child("members").child(props.user.uid).child("allowed").set(0);
    }

    const selectChannel = (channel) => {
        setLastVisited(props.user,props.channel);
        setLastVisited(props.user,channel);
        props.selectChannel(channel);
    }

    return(
        <>
        <Menu.Menu>
            <Menu.Item>
                <span>
                    <Icon name="comments"/> Channels [{channelsState.length}]
                </span>
            </Menu.Item>
            {displayChannels()}
            <Menu.Item>
                <span>
                    <Icon style={{fontWeight: 'bold' }}className="clickable" name="add" onClick={openModal}>ADD</Icon>
                </span>
            </Menu.Item>
        </Menu.Menu>
        <Modal data-aos="zoom-in" open={modalOpen} onClose={closeModal} className="channelModal">
            <Modal.Header>
                Create Channel
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={onSubmit}>
                    <Form.Input
                        name="name"
                        value={addChannel.name}
                        onChange={handleInput}
                        type="text"
                        placeholder="Enter channel name"
                    />
                    <Form.Input
                        name="description"
                        value={addChannel.description}
                        onChange={handleInput}
                        type="text"
                        placeholder="Enter channel descripiton"/>
                    <Form.Input
                        name="password"
                        value={addChannel.password}
                        onChange={handleInput}
                        type="text"
                        placeholder="Enter password (optional, only if you want a private channel)"/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button loading={isLoading} onClick={onSubmit} className="modalButton">
                    <Icon name="plus"/>Add
                </Button>
                <Button onClick={closeModal} className="modalButton">
                    <Icon name="remove" />Cancel
                </Button>
            </Modal.Actions>
        </Modal>

        <Modal data-aos="zoom-in" open={privateModalOpen} onClose={closePrivateModal} className="channelModal">
            <Modal.Header>
                Join Private Chat
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={JoinPrivate}>
                    <Form.Input
                        name="password"
                        value={channelPassword.password}
                        onChange={handlePasswordInput}
                        type="text"
                        placeholder="Enter password"/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button loading={isLoading} onClick={JoinPrivate} className="modalButton">
                    <Icon name="plus"/>Join
                </Button>
                <Button onClick={closePrivateModal} className="modalButton">
                    <Icon name="remove" />Cancel
                </Button>
            </Modal.Actions>
        </Modal>
        </>
    )
}

const mapStateToProps = (state) =>{
    return {
        user: state.user.currentUser,
        channel : state.channel.currentChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        selectChannel : (channel) => dispatch(setChannel(channel))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Channels)