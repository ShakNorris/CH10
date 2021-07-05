import React,{useState} from 'react';
import './Authentication.css'
import Login from './Login';
import fire from '../../config/firebase';
import firebase from 'firebase'


const Authentication = () => {

    let user = {
        userName: '',
        email: '',
        password: '',
        confirmpassword: ''
    }

    let userCollectionRef = firebase.database().ref('users');

    let errors = [];

    const [userState, setuserState] = useState(user);
    const [errorState, seterrorState] = useState(errors);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasAccount,setHasAccount] = useState(false);

    const handleInput = (event) => {
        let target = event.target;
        setuserState((currentState) => {
            let currentuser = { ...currentState };
            currentuser[target.name] = target.value;
            return currentuser;
        })
    }

    const checkForm = () => {
        if (isFormEmpty()) {
            seterrorState((error) => error.concat({ message: "Please fill in all fields" }));
            return false;
        }
        return true;
    }

    const isFormEmpty = () => {
        if(hasAccount){
            return !userState.userName.length ||
            !userState.password.length ||
            !userState.confirmpassword.length ||
            !userState.email.length;
        }
        else{
            return !userState.password.length ||
            !userState.email.length;
        }
    }

    const formaterrors = () => {
        return errorState.map((error, index) => <p key={index}>{error.message}</p>)
    }

    const checkPassword = () => {
        if (userState.password.length < 8) {
            seterrorState((error) => error.concat({ message: "Password length should be greater than 8" }));
            return false;
        }
        else if (userState.password !== userState.confirmpassword) {
            seterrorState((error) => error.concat({ message: "Password and Confirm Password does not match" }));
            return false;
        }
        return true;
    }

    const onSubmitRegister = (event) => {
        seterrorState(() => []);
        setIsSuccess(false);
        if (checkForm()) {
            setIsLoading(true);
            fire.auth()
                .createUserWithEmailAndPassword(userState.email, userState.password)
                .then(createdUser => {
                    setIsLoading(false);
                    updateuserDetails(createdUser);
                })
                .catch(serverError => {
                    setIsLoading(false);
                    seterrorState((error) => error.concat(serverError));
                })
        }
    }

    const onSubmitLogin = (event) => {
        seterrorState(() => []);
        setIsSuccess(false);
        if (checkForm()) {
            setIsLoading(true);
            fire.auth()
            fire.auth()
            .signInWithEmailAndPassword(userState.email, userState.password)
            .then(user => {
                setIsLoading(false);
                console.log(user);
            })
            .catch(serverError => {
                setIsLoading(false);
                seterrorState((error) => error.concat(serverError));
            })
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    const updateuserDetails = (createdUser) => {
        if (createdUser) {
            setIsLoading(true);
            createdUser.user
                .updateProfile({
                    displayName: userState.userName,
                    photoURL: `http://gravatar.com/avatar/${getRandomInt(1000)}?d=identicon`,
                    bio: userState.bio
                })
                .then(() => {
                    setIsLoading(false);
                    saveUserInDB(createdUser);
                })
                .catch((serverError) => {
                    setIsLoading(false);
                    seterrorState((error) => error.concat(serverError));
                })
        }
    }

    const saveUserInDB = (createdUser) => {
        setIsLoading(true);
        userCollectionRef.child(createdUser.user.uid).set({
            displayName: createdUser.user.displayName,
            photoURL: createdUser.user.photoURL,
            bio: "Nothing to see here — yet."
        })
            .then(() => {
                setIsLoading(false);
                setIsSuccess(true);
            })
            .catch(serverError => {
                setIsLoading(false);
                seterrorState((error) => error.concat(serverError));
            })
    }

    const handleGoogleAuth = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        fire.auth()
        .signInWithPopup(provider)
        .then((result) => {
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
            userCollectionRef.child(user.uid).set({
                displayName: user.displayName,
                photoURL: user.photoURL,
                bio: user.bio
            })
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    }

    return (
        <div>
            <Login 
            userState = {userState}
            setuserState = {setuserState}
            errorState = {errorState}
            seterrorState = {seterrorState}
            isLoading = {isLoading}
            setIsLoading = {setIsLoading}
            isSuccess = {isSuccess}
            setIsSuccess = {setIsSuccess}
            handleGoogleAuth = {handleGoogleAuth}
            hasAccount = {hasAccount}
            setHasAccount = {setHasAccount}
            handleInput = {handleInput}
            checkForm = {checkForm}
            isFormEmpty = {isFormEmpty}
            formaterrors = {formaterrors}
            checkPassword = {checkPassword}
            onSubmitRegister = {onSubmitRegister}
            onSubmitLogin = {onSubmitLogin}
            updateuserDetails = {updateuserDetails}
            saveUserInDB = {saveUserInDB}
            />
        </div>
    )
}

export default Authentication