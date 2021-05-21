import React from 'react'
import {connect} from 'react-redux'
import { Menu, Icon} from 'semantic-ui-react'
import { setChannel } from '../../../store/actions'
import './FavoriteChannels.css'

const FavoriteChannel = (props) => {

    const displayChannels = () => {
        if(Object.keys(props.favoriteChannels).length > 0)
        return Object.keys(props.favoriteChannels).map((channelId)=>{
            return <Menu.Item
            key={channelId}
            name={props.favoriteChannels[channelId]}
            onClick={()=> props.selectChannel({id:channelId,name:props.favoriteChannels[channelId], isFavorite : true})}
            active={props.channel && channelId === props.channel.id && props.channel.isFavorite}>
                {"# " + props.favoriteChannels[channelId]}
            </Menu.Item>
        })
    }

    return(
        <div className="favChannelsDisplay">
            <Menu.Menu>
                <Menu.Item>
                    <span>
                        <Icon name="heart"/> Favorite Channels [{Object.keys(props.favoriteChannels).length }]
                    </span>
                </Menu.Item>
                {displayChannels()}
            </Menu.Menu>
        </div>
    )
}

const mapStateToProps = (state) =>{
    return {
        user: state.user.currentUser,
        channel : state.channel.currentChannel,
        favoriteChannels : state.favoriteChannel.favoriteChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        selectChannel : (channel) => dispatch(setChannel(channel))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FavoriteChannel)