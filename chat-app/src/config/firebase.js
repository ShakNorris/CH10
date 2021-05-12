import firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB2r8j7kaJO51FSAU8NTUlidKX0ZnnIpxA",
    authDomain: "ch10-93af7.firebaseapp.com",
    projectId: "ch10-93af7",
    storageBucket: "ch10-93af7.appspot.com",
    messagingSenderId: "1066021559716",
    appId: "1:1066021559716:web:5b4059914dd0319afe7531"
  };
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export default fire;