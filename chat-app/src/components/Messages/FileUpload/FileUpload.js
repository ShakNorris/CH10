import React,{useState} from 'react'
import {Modal,Input,Button,Icon} from 'semantic-ui-react'
import Mime from 'mime-types'
import './FileUpload.css'

const FileUpload = (props) =>
{

    const [file,setFile] = useState(null);

    const acceptedPhotoTypes = ["image/png","image/jpeg","image/jpg","image/gif"]
    const onFileAdded = (e) =>{
        const file = e.target.files[0];
        if(file){
            setFile(file)
        }
    }

    const Submit = () =>{
        if(file && acceptedPhotoTypes.includes(Mime.lookup(file.name))){
            props.uploadImage(file,Mime.lookup(file.name))
            props.onClose()
            setFile(null)
        }
    }

    return(
        <Modal basic open={props.open} onClose={props.onClose} className="fileModal">
            <Modal.Header>Send a file</Modal.Header>
            <Modal.Content>
                <Input
                name="file"
                type="file"
                onChange={onFileAdded}
                className="fileInput"
                />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={Submit}><Icon name="upload"/>Upload</Button>
                <Button onClick={props.onClose}><Icon name="cancel"/>Cancel</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default FileUpload