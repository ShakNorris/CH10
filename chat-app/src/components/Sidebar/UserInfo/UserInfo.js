import React from 'react';
import {Grid,Image,Header,Dropdown} from 'semantic-ui-react'
import {connect} from 'react-redux'
import './UserInfo.css'
import fire from '../../../config/firebase';

const getDropDown = () =>{
    return[{
        key: 'logout',
        text:<span onClick={signOut}>Log Out</span>
    }]
}

const signOut = () =>{
    return fire.auth().signOut();
}

const UserInfo = (props) =>{
    if(props.user){
        return(
            <Grid>
                <Grid.Column>
                    <Grid.Row className="userInfo-row">
                        <Header inverted as="h1">
                            <p className="logo">
                                <img src={process.env.PUBLIC_URL + '/HomerMain.png'}/>
                            </p>
                        </Header>
                        <Header inverted as="h4" className="displayUser">
                            <Dropdown icon={null}
                            trigger={
                                <span className="userInfo">
                                    <Image src={props.user.photoURL}/>
                                    <p>{props.user.displayName}</p>
                                </span>
                            } options={getDropDown()}>
                            </Dropdown>
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
    return null;
}

const mapStateToProps= (state) => {
    return{
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(UserInfo)