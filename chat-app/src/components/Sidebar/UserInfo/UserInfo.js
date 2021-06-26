import React,{useState,useEffect} from 'react';
import {Grid,Image,Header, Icon, Modal,Form, Button, TextArea, Input} from 'semantic-ui-react'
import {connect} from 'react-redux'
import './UserInfo.css'
import fire from '../../../config/firebase';
import AOS from "aos";
import "aos/dist/aos.css";
import {v4 as uuidv4} from 'uuid'
import Mime from 'mime-types'
import { setUser } from '../../../store/actions';


const signOut = () =>{
    return fire.auth().signOut();
}

const UserInfo = (props) =>{
    const acceptedPhotoTypes = ["image/png","image/jpeg","image/jpg"]

    let usersRef = fire.database().ref('users');
    const storageRef = fire.storage().ref();

    const [modalOpen,setModalOpen] = useState(false)
    let userBio = "";

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

    if(props.user?.uid){
        usersRef.child(props.user.uid).on('value',snap=>{
            userBio = snap.val().bio;
        })
    }

    const BioChange = (e) => {
        userBio = e.target.value;
    }

    const changeBio = () => {
        usersRef.child(props.user.uid).on('value',snap=>{
            snap.ref.update({bio: userBio}); 
        })
    }

    const handleChangeBio = (e) => {
        if (e.which === 13) {
            changeBio();
        }
    }

    const triggerUpload = () =>{
        document.getElementById("ImageChange").click()
    }

    const ChangePicture = (e) => {
        const file = e.target.files[0];
        if(file && acceptedPhotoTypes.includes(Mime.lookup(file.name))){
            const filePath = `chat/profilePics/${uuidv4()}`;
            storageRef.child(filePath).put(file).
            then((data)=>{
                data.ref.getDownloadURL()
                .then((url)=>{
                    props.user.updateProfile({
                        photoURL: url,
                    })
                    usersRef.child(props.user.uid).on('value',snap=>{
                        snap.ref.update({photoURL: url}); 
                    })
                })
            })
        }
    }

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
                                <Modal data-aos="zoom-in" open={modalOpen} onClose={closeModal} className="userModal">
                                    <Modal.Header>
                                        User Info
                                    </Modal.Header>
                                    <Modal.Content className="userInfoModal">
                                    <input classname="userImage" type="image" src={props.user.photoURL} onClick={triggerUpload}/>
                                    <input type="file" id="ImageChange" style={{display:'none'}} onChange={ChangePicture}/>
                                        <p>{props.user.displayName}</p>
                                        <p className="userBio">About Me</p>
                                        <textarea onChange={BioChange} onKeyPress={handleChangeBio}>{userBio}</textarea>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button onClick={signOut} className="modalButton">
                                            <Icon name="sign-out" />Log Out
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