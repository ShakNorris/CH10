import React,{useEffect,useState} from 'react';
import './Authentication.css'
import Login from './Login';
import fire from '../../config/firebase';
import firebase from 'firebase'


const Authentication = () => {
    const [user,setUser] = useState("");
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [emailError,setEmailError] = useState("");
    const [passwordError,setPasswordError] = useState("");
    const [hasAccount,setHasAccount] = useState(false);

    const clearInputs = () => {
        setEmail("");
        setPassword("");
    }

    const clearErrors = () => {
        setEmailError("");
        setPasswordError("");
    }

    const handleLogin = () => {
        clearErrors();
        fire
        .auth()
        .signInWithEmailAndPassword(email,password)
        .catch((err) => {
            switch(err.code){
                case "auth/invalid-email":
                case "auth/user-disabled":
                case "auth/user-not-found":
                    setEmailError(err.message);
                    break;
                case "auth/wrong-password":
                    setPasswordError(err.message);
                    break;
            }
        })
    }

    const handleGoogleAuth = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        fire.auth()
        .signInWithPopup(provider)
        .then((result) => {
            // /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            var token = credential.accessToken;
            var user = result.user;
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    }

    const handleSignUp = () =>{ 
        clearErrors();
        fire
        .auth()
        .createUserWithEmailAndPassword(email,password)
        .catch((err) => {
            switch(err.code){
                case "auth/email-already-in-use":
                case "auth/invalid-email":
                    setEmailError(err.message);
                    break;
                case "auth/weak-password":
                    setPasswordError(err.message);
                    break;
            }
        })
    }

    const AuthListener = () =>{
        fire.auth().onAuthStateChanged(user =>{
            if(user){
                clearInputs();
                setUser(user);
            }
            else{
                setUser("");
            }
        })
    }

    useEffect(() => {
        AuthListener();
    }, [])

    return (
        <div>
            {/* {user ?
            (<p>Welcome! {username}</p>
            ) : ( */}
            <Login 
            user = {user}
            setUser = {setUser}
            username = {username}
            setUsername = {setUsername}
            email = {email} 
            setEmail = {setEmail} 
            password = {password} 
            setPassword = {setPassword} 
            handleLogin = {handleLogin}
            handleSignUp = {handleSignUp}
            handleGoogleAuth = {handleGoogleAuth}
            hasAccount = {hasAccount}
            setHasAccount = {setHasAccount}
            emailError = {emailError}
            passwordError = {passwordError}
            />
            {/* )} */}
        </div>
    )
}

export default Authentication