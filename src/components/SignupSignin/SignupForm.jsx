import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
// Components
import Input from '../Input/Input'
import Button from '../Button/Button'

import './styles.css'

// Other imports
import { auth , db, provider } from '../../firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {setDoc,doc, getDoc} from "firebase/firestore";
import { toast } from 'react-toastify';

const SignupForm = ({setFlag,flag}) => {
    const [name,setName]=useState("");
    const[email,setEmail]=useState(""); 
    const[password,setPassword]=useState("");
    const[confirmPassword,setConfirmPassword]=useState("");
    const navigate=useNavigate();

    const[loading,setLoading]=useState(false);
    // Using firebase auth method to signup with email and password
    function signupWithEmail(){
        setLoading(true);
        if(name && email && password!="" && confirmPassword!=""){
            if(password===confirmPassword){
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                   console.log("User -> ",user);
                   toast.success("User Created successfully");
                   setLoading(false);
                   createDoc(user);
                   navigate("/dashboard");
                })
                .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                toast.error(errorMessage);
                });
             }
             else{
                toast.error("Password Mismatched");
                // setLoading(false);
             }
           
         }
         else{
            toast.error("Check the details properly")
            setLoading(false);
         }
    }
    function googleAuth(){
        setLoading(true);
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            console.log(user);
            createDoc(user);
            toast.success("User Created Successfully");
            navigate("/dashboard")
            setLoading(false);
        
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            toast.error(errorMessage);
            setLoading(false);
            // ...
        });
    }
    async function createDoc(user){
        // making sure that the doc with the uid doesnt exist then creating a doc
        setLoading(true);

        if(!user) return;
        const userRef=doc(db,"users",user.uid);
        const userData = await getDoc(userRef);
        if(!userData.exists()){
        try{
            await setDoc(doc(db, "users", user.uid),{
            name : user.displayName? user.displayName:name,
            email: user.email,
            photoURL: user.photoURL? user.photoURL:"",
            createdAt:new Date()
          });
            console.log("Doc created");
        }
        catch(e){
            console.log(e.message);
          toast.error(e.message);
        }
      }
      else{
        // toast.error("Doc already exists");
        setLoading(false);
        }
    }


  return (
    <>
    <div className='signup-wrapper'>
        <h2 className='title'>Sign up on<span className='logo-style'> Financely.</span></h2>
        <form>
            <Input
            label={"Full Name"}
            value={name}
            placeholder={"Enter your Name"}
            setState={setName}
            >
            </Input>
            <Input
            type={"email"}
            label={"email"}
            value={email}
            placeholder={"Enter your Mail ID"}
            setState={setEmail}
            >
            </Input>
            <Input
            type={"password"}
            label={"password"}
            value={password}
            placeholder={"Enter your Password"}
            setState={setPassword}
            >
            </Input>
            <Input
             type={"password"}
            label={"confirm password"}
            value={confirmPassword}
            placeholder={"Confirm your Password"}
            setState={setConfirmPassword}
            >
            </Input>
            <Button 
            text={loading?"Loading...":"Sign up using Email and Password"} 
            onClick={signupWithEmail}>
            </Button>
            <p style={{textAlign:"center",fontSize:"0.9rem" }}>or</p>
            <Button text={loading?"Loading...":"Sign up using Google" } 
            blue={true} 
            onClick={googleAuth}>
            </Button>
            <p className='p-login' onClick={() => setFlag(!flag)}>
            Already have an account ? Click Here .
            </p>
        </form>
        
    </div>
    </>
      
  
  )
}

export default SignupForm