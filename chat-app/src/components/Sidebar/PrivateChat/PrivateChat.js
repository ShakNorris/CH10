import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { Menu, Icon} from 'semantic-ui-react'
import fire from '../../../config/firebase'
import firebase from 'firebase'
import { setChannel } from '../../../store/actions'
import {Notifications} from '../Notifications/Notifications'
import './PrivateChat.css'

const PrivateChat = (props) => {

    const [users, setUsers] = useState([])
    const [connectedUser,setConnectedUser] = useState([])
    const usersRef = fire.database().ref("users");
    const connectedRef = fire.database().ref(".info/connected")
    const statusRef = fire.database().ref("status")

    useEffect(() => {
        usersRef.on('child_added', (snap) => {
            setUsers((currentState) => {
                let updatedState = [...currentState];

                let user = snap.val();
                user.name = user.displayName;
                user.id = snap.key;
                user.isPrivateChat = true;
                updatedState.push(user);             
                return updatedState;
            })
        });

        connectedRef.on("value", snap => {
            if(props.user && snap.val()){
                const userStatusRef = statusRef.child(props.user.uid);
                userStatusRef.set(true);
                userStatusRef.onDisconnect().remove();
            }
        })

        return () => {usersRef.off(); connectedRef.off();}
    }, [props.user])


    useEffect(()=>{
        statusRef.on("child_added", snap => {
            setConnectedUser((currentState) => {
                let updatedState = [...currentState]
                updatedState.push(snap.key);
                return updatedState;
            })
        });

        statusRef.on("child_removed", snap => {
            setConnectedUser((currentState) => {
                let updatedState = [...currentState]
                let index = updatedState.indexOf(snap.key)
                updatedState.splice(index,1);
                return updatedState;
            })
        });
        return () => statusRef.off();
    },[users])

    const displayUsers = () => {
        return users.filter((user)=>user.id !== props.user?.uid).map((user)=>{
            return <Menu.Item
            key={user.id}
            name={user.name}
            onClick={()=> selectUser(user)}
            active={props.channel && generateChannelID(user.id) === props.channel.id}>
                <div className="userActivity">
                <Icon name="circle" color={`${connectedUser.indexOf(user.id) !== -1 ? "green" : "red"}`} /> 
                </div>
                {user.name}
                <Notifications
                user={props.user} 
                channel={props.channel} 
                channelNotification={generateChannelID(user.id)}
                />
            </Menu.Item>
        })
    }

    const selectUser = (user) => {
        const userTemp = {...user}
        userTemp.id = generateChannelID(user.id)
        setLastVisited(props.user,props.channel);
        setLastVisited(props.user,userTemp);
        props.selectChannel(userTemp);
    }

    const generateChannelID = (userID) => {
        if(props.user?.uid < userID){
            return props.user.uid + userID
        }
        else{
            return userID + props.user?.uid
        }
    }

    const setLastVisited = (user,channel) => {
        const lastVisited = usersRef.child(user.uid).child("lastVisited").child(channel.id);
        lastVisited.set(firebase.database.ServerValue.TIMESTAMP)
        lastVisited.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP)
    }

    return(
        <div className="usersDisplay">
            <Menu.Menu>
                <Menu.Item>
                    <span>
                        <Icon name="comment"/> Users [{users.length - 1}]
                    </span>
                </Menu.Item>
                {displayUsers()}
            </Menu.Menu>
        </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(PrivateChat)