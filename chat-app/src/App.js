import React,{useEffect,useState} from 'react';
import './App.css'
import Login from './Authorization/Login';


const App = () => {
    const [user,setUser] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [emailError,setEmailError] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
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
        // clearErrors();
        // fire
        // .auth()
        // .signInWithEmailAndPassword(email,password)
        // .catch((err) => {
        //     switch(err.code){
        //         case "auth/invalid-email":
        //         case "auth/user-disabled":
        //         case "auth/user-not-found":
        //             setEmailError(err.message);
        //             break;
        //         case "auth/wrong-password":
        //             setPasswordError(err.message);
        //             break;
        //     }
        // })
    }

    const handleSignUp = () =>{ 
        // clearErrors();
        // fire
        // .auth()
        // .createUserWithEmailAndPassword(email,password)
        // .catch((err) => {
        //     switch(err.code){
        //         case "auth/email-already-in-use":
        //         case "auth/invalid-email":
        //             setEmailError(err.message);
        //             break;
        //         case "auth/weak-password":
        //             setPasswordError(err.message);
        //             break;
        //     }
        // })
    }

    const AuthListener = () =>{
        // fire.auth().onAuthStateChanged(user =>{
        //     if(user){
        //         clearInputs();
        //         setUser(user);
        //     }
        //     else{
        //         setUser("");
        //     }
        // })
    }

    useEffect(() => {
        AuthListener();
    }, [])

    return (
        <div>
            {user ?
            (<p>Welcome!</p>
            ) : (
            <Login 
            user = {user}
            setUser = {setUser}
            firstName = {firstName}
            setFirstName = {setFirstName}
            lastName = {lastName}
            setLastName = {setLastName}
            email = {email} 
            setEmail = {setEmail} 
            password = {password} 
            setPassword = {setPassword} 
            handleLogin = {handleLogin}
            handleSignUp = {handleSignUp}
            hasAccount = {hasAccount}
            setHasAccount = {setHasAccount}
            emailError = {emailError}
            passwordError = {passwordError}
            />)}
        </div>
    )
}

export default App