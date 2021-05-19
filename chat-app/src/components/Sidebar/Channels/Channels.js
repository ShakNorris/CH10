import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { Menu, Icon, Modal,Form, Button} from 'semantic-ui-react'
import fire from '../../../config/firebase'
import { setChannel } from '../../../store/actions'
import './Channels.css'

const Channels = (props) => {
    const [modalOpen,setModalOpen] = useState(false)
    const [addChannel,setAddChannel] = useState({name : '', description : ''})
    const [isLoading,setIsLoading] = useState(false)
    const [channelsState, setChannelsState] = useState([])
    
    const channelsRef = fire.database().ref("channels");

    useEffect(() => {
        channelsRef.on('child_added', (snap) => {
            setChannelsState((currentState) => {
                console.log(currentState)
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
        }
    },[!props.channel ? channelsState : null])


    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const formValidation = () =>{
        return addChannel && addChannel.name && addChannel.description
    }

    const handleInput = (e) => {
        let target = e.target
        setAddChannel((currentState) =>{
            console.log(currentState)
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
            createdBy : {
                user: props.user.displayName,
                avatar : props.user.photoURL
            }
        }
        setIsLoading(true)
        channelsRef.child(key)
        .update(channel).then(()=>{
            setAddChannel({Name : '', Description : ''});
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
            onClick={()=> props.selectChannel(channel)}
            active={props.channel && channel.id === props.channel.id}>
            </Menu.Item>
        })
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
                    <Icon className="clickable" name="add" onClick={openModal}>Add</Icon>
                </span>
            </Menu.Item>
        </Menu.Menu>
        <Modal open={modalOpen} onClose={closeModal} className="channelModal">
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