// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {getAuth , createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js"
import{getFirestore,setDoc,doc} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBFkDbW0bXuFK0ZETmZAYCt5FJjLQAcko",
  authDomain: "login-86287.firebaseapp.com",
  projectId: "login-86287",
  storageBucket: "login-86287.firebasestorage.app",
  messagingSenderId: "309104465096",
  appId: "1:309104465096:web:5a2708ff71006b5dfd41fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message,divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
}
const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click',(event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();   
    const db=getFirestore();

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
       const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName: lastName
        };  
        showMessage('Account Created Successfully','signUpMessage');
        const docRef=doc(db,"users",user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("error writing document",error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Already Exists !!!','signUpMessage');
        }
        else{
            showMessage('unable to create User','signUpMessage');
        }
    })
}); 

const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click',(event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        showMessage('login is successfull','signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId',user.uid);
        window.location.href='minigame/gamesweb/index.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password','signInMessage');
        }
        else{
            showMessage('Account does not Exist','signInMessage'); 
        }
    })
})
    




 