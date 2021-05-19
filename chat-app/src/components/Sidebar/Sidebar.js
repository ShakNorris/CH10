import React from 'react'
import {Menu} from 'semantic-ui-react';
import './Sidebar.css'
import UserInfo from './UserInfo/UserInfo'
import Channels from './Channels/Channels'

export const Sidebar = () => {
    return(
        <Menu vertical fixed="left" borderless size="large" className='side-bar'>
            <UserInfo/>
            <Channels/>
        </Menu>
    )
}