import React,{useState,useEffect} from 'react';
import {Grid,Image,Header, Icon, Modal,Form, Button} from 'semantic-ui-react'
import {connect} from 'react-redux'
import './UserInfo.css'
import fire from '../../../config/firebase';
import AOS from "aos";
import "aos/dist/aos.css";

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
    const [modalOpen,setModalOpen] = useState(false)

    const openModal = () => {
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    useEffect(() => {
        AOS.init();
        AOS.refresh();
    });

    if(props.user){
        return(
            <div className="UserInfo">
            <Header inverted as="h1">
                <p className="logo">
                    <img src={process.env.PUBLIC_URL + '/HomerBanner2.jpg'}/>
                </p>
            </Header>
            <Grid>
                <Grid.Column>
                    <Grid.Row className="userInfo-row">
                        <Header inverted as="h4" className="displayUser">
                            <div className="user">
                                <span onClick={openModal} className="userInfo">
                                    <Image src={props.user.photoURL}/>
                                    <p>{props.user.displayName}</p>
                                </span>
                                <Modal data-aos="zoom-in" open={modalOpen} onClose={closeModal} className="channelModal">
                                    <Modal.Header>
                                        User Info
                                    </Modal.Header>
                                    <Modal.Content>
                                        <Image src={props.user.photoURL}/>
                                        <p>{props.user.displayName}</p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={signOut} className="modalButton">
                                            Log Out
                                        </Button>
                                        <Button onClick={closeModal} className="modalButton">
                                            <Icon name="remove" />Close
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </div>
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
            </div>
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