import React from 'react'
import {Menu} from 'semantic-ui-react';
import './Sidebar.css'
import UserInfo from './UserInfo/UserInfo'
import Channels from './Channels/Channels'
import PrivateChat from './PrivateChat/PrivateChat'
import FavoriteChannels from './FavoriteChannels/FavoriteChannels'

export const Sidebar = () => {
    return(
        <Menu vertical fixed="left" borderless size="large" className='side-bar'>
            <UserInfo/>
            <FavoriteChannels/>
            <Channels/>
            <PrivateChat />
        </Menu>
    )
}