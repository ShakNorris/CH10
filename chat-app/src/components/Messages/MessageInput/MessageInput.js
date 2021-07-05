import React, {useState, createRef} from 'react';
import {Segment,Header,Icon,Input,Button, Modal,Image} from 'semantic-ui-react'
import './MessageInput.css'
import fire from '../../../config/firebase'
import firebase from 'firebase'
import {connect} from 'react-redux'
import FileUpload from '../FileUpload/FileUpload'
import {v4 as uuidv4} from 'uuid'
import Picker from 'emoji-picker-react';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

const MessageInput = (props) =>{

    const messagesRef = fire.database().ref("messages");
    const storageRef = fire.storage().ref();

    const [showEmojis,setShowEmojis] = useState(false);
    const [message,setMessage] = useState("")
    const [fileDialog,setFileDialog] = useState(false)

    const API_KEY = "6CCRGHRABll6ebZeCrx4YWekz1Fjy8Sf";
    const GIPHY_API = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=20&q=`;
    const [gifSearch,setGifSearch] = useState("");
    const [gifs, setGifs] = useState([]);
    const [gifLoading,setGifLoading] = useState(false);
    const [gifModal,setGifModal] = useState(false);
    const [closeEmoji,setcloseEmoji] = useState(false);
    const [closeGif,setCloseGif] = useState(false);
    let file_type = "";
    let file_name = "";

    const createMessageInfo = (downloadUrl) =>{
        return{
            user : {
                avatar : props.user.photoURL,
                name : props.user.displayName,
                id : props.user.uid
            },
            content : message,
            image : downloadUrl || "",
            fileType : file_type || "",
            fileName : file_name || "", 
            timestamp : firebase.database.ServerValue.TIMESTAMP
        }
    }

    const sendMessage = (downloadUrl) =>{
        if(downloadUrl && file_type !== ""){
            messagesRef.child(props.channel.id)
            .push().set(createMessageInfo(downloadUrl))
            .then(() => setMessage(""))
            .catch((err) => console.log(err))
            file_type = "";
        }
    }

    const sendText = () => {
        if(message){
            messagesRef.child(props.channel.id)
            .push().set(createMessageInfo())
            .then(() => setMessage(""))
            .catch((err) => console.log(err))
        }
    }

    const MessageChange = (e) => {
        const target = e.target
        setMessage(target.value)
    }

    const actionButtons = () =>{
        return <>
        <div className="InputButton">
            <Button icon="send"
            onClick={sendText}/>
            <Button icon="upload" onClick={() => setFileDialog(true)}/>
        </div>
        </>
    }

    const handleKeypress = e => {
      if (e.which === 13) {
        sendText();
      }
    };

    const uploadImage = (file,type) => {
        const filePath = `chat/images/${uuidv4()}`
        storageRef.child(filePath).put(file,{type : type})
        .then((data) => {
            file_type = data.metadata.contentType
            data.ref.getDownloadURL()
            .then((url)=> sendMessage(url))
        })
        .catch((err)=> console.log(err))
    }

    const uploadVideo =  (file,type) => {
        const filePath = `chat/videos/${uuidv4()}`;
        storageRef.child(filePath).put(file,{type : type})
        .then((data) => {
            file_type = data.metadata.contentType
            data.ref.getDownloadURL()
            .then((url)=> sendMessage(url))
        })
        .catch((err)=> console.log(err))
    }

    const uploadOtherFiles = (file) => {
        const filePath = `chat/otherFiles/${uuidv4()}`
        file_name = file.name;
        storageRef.child(filePath).put(file)
        .then((data) => {
            file_type = data.metadata.contentType
            data.ref.getDownloadURL()
            .then((url)=> sendMessage(url))
        })
    }

    const handleShowEmojis = () => {
        if(!showEmojis){
            setShowEmojis(true);
        }
        else{
            setShowEmojis(false);
        }
    }

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji)
    };

    const displayEmojiBox = () =>{
        if(showEmojis){
            return <Picker onEmojiClick={onEmojiClick} />
        }
    }

    const openModal = () => {
        setCloseGif(true);
        setcloseEmoji(true);
        setGifs([]);
        setGifModal(true);
    }

    const closeModal = () => {
        setGifModal(false);
        setCloseGif(false);
        setcloseEmoji(false);
    }

    const searchGif = () => {
        setGifs([]);
        if(gifSearch.length > 0){
            setGifLoading(true);
            fetch(GIPHY_API+gifSearch)
            .then((res)=>{
                setGifLoading(false);
                return res.json();
            })
            .then((result)=>{
                setGifs(result.data.map((gif=>{
                    return gif.images.fixed_height.url;
                })));
            })
            .catch(()=>{
                setGifLoading(false);
            })
        }
        setGifSearch("");
    }

    const handleGifSearch = (e) => {
        if (e.which === 13) {
            searchGif();
        }
    }

    const sendGif =  async (e,type) => {
        e.preventDefault();
        var FileUrl = e.target.src;
        let file = await fetch(FileUrl).then(r => r.blob()).
        then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/gif" }));
        const filePath = `chat/images/${uuidv4()}`
        storageRef.child(filePath).put(file)
        .then((data) => {
            file_type = data.metadata.contentType
            data.ref.getDownloadURL()
            .then((url)=> sendMessage(url))
        })
        .catch((err)=> console.log(err));
        closeModal();
    }

    const displayGifs = () =>{
        return(
            <>
            <div className="gifHeader">
                <Input type="text"
                placeholder="Search GIPHY"
                value={gifSearch}
                onChange={(e)=>setGifSearch(e.target.value)}
                onKeyPress={handleGifSearch}
                ></Input>
                <Button onClick={searchGif}>Search</Button>
            </div>
            <div className="gifResult">
                <div className="gifList">
                {
                    gifs.map((gif)=>{
                        return(
                            <div className="gifItem">
                                <Image onClick={sendGif} src={gif}/>
                            </div>
                        )
                    })
                }
                </div>
            </div>
            </>
        )
    }


    return <Segment className="InputSegment">
        <div className="emoji-toggler">
            {(closeEmoji == false) && <Button onClick={handleShowEmojis}><InsertEmoticonIcon className="emoji"/></Button>}
        </div>
        <div className="gif-toggler">
            {(closeGif == false) && <Button onClick={openModal}><img src={process.env.PUBLIC_URL + '/GifIcon.png'}/></Button>}
        </div>
        <Modal basic open={gifModal} onClose={closeModal} className="gifModal">
            <Modal.Actions className="gifButton">
                <Button onClick={closeModal}>
                    <Icon name="remove" />
                </Button>
            </Modal.Actions>
            <div data-aos="zoom-in">
                <Modal.Content className="gifContent">
                    {displayGifs()}
                </Modal.Content>
            </div>
        </Modal>
        <div className="emoji-box">
            {displayEmojiBox()}
        </div>
        <Input
        onChange={MessageChange}
        name="message"
        value={message}
        label={actionButtons()}
        labelPosition="right"
        fluid={true}
        onKeyPress={handleKeypress}></Input>
        <FileUpload uploadImage={uploadImage} uploadOtherFiles={uploadOtherFiles} uploadVideo={uploadVideo} open={fileDialog} onClose={() => setFileDialog(false)}/>
    </Segment>
}

const mapStateToProps = (state) =>{
    return{
        user : state.user.currentUser,
        channel : state.channel.currentChannel
    }
}

export default connect(mapStateToProps)(MessageInput);