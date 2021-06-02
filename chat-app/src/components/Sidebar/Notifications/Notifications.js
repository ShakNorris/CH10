import React, {useState, useEffect } from 'react'
import fire from '../../../config/firebase'
import {Label} from 'semantic-ui-react'

export const Notifications = (props) => {

    const messagesRef = fire.database().ref("messages")
    const usersRef = fire.database().ref("users");

    const [visitedChannel,setVisitedChannel] = useState({})
    const [messageTimeStamp,setMessagesTimeStamp] = useState({})

    useEffect(()=>{
        if(props.user?.uid){
            usersRef.child(props.user.uid).child("lastVisited").on('value',snap=>{
                setVisitedChannel(snap.val());
            })

            messagesRef.on('value',snap=>{
                let messages = snap.val();
                let channelsID = Object.keys(messages);
                let messagesTimeStamp = {};
                channelsID.forEach((channelId)=>{
                    let channelMessageKeys = Object.keys(messages[channelId])
                    channelMessageKeys.reduce((agg,item)=>{
                        messagesTimeStamp[channelId] = [...messagesTimeStamp[channelId] || []]
                        messagesTimeStamp[channelId].push(messages[channelId][item].timestamp)
                    })
                })
                setMessagesTimeStamp(messagesTimeStamp);
            })
        }
    },[props.user])

    const NotificationCount = (channelID) =>{
        if(visitedChannel && messageTimeStamp && props.channel && props.channel.id !== channelID){
            let lastVisited = visitedChannel[channelID]
            let channelMessageTS = messageTimeStamp[channelID]
            if(channelMessageTS){
                let NotificationCount = channelMessageTS.filter(timestamp => !lastVisited || lastVisited <= timestamp).length;
                return NotificationCount === 0 ? null : <Label color="red">{NotificationCount}</Label>
            }
        }
        return null;
    }

    return <>{NotificationCount(props.channelNotification)} </>
}