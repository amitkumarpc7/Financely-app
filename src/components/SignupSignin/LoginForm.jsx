import React, { useState } from 'react'
import Input from '../Input/Input';
import Button from '../Button/Button';
import './styles.css'

// Other Imports
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({setFlag,flag}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    // Using firebase login code for Logging in
    function handleLogin(){
        setLoading(true) 
        if(email!="" && password !=""){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            toast.success("Logged in successfully")
            console.log("User",user);
            setLoading(false);
            
        })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            navigate("/dashboard");
            });    
        }
        else{
            toast.error("All fields mandatory")
            setLoading(false)
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
  return (
   <div className='signup-wrapper'>
         <h2 className='title'>Login to<span className='logo-style'> Financely.</span></h2>
         <form>
         <Input
            type="email"
            label={"email"}
            placeholder="Email"
            state={email}
            setState={setEmail}
            required={true}
        />
        <Input
            type="password"
            label={"password"}
            placeholder="Password"
            state={password}
            setState={setPassword}
            required={true}
        />

        <Button
            text={loading ? "Loading..." : "Login with Email"}
            onClick={handleLogin}
            disabled={loading}
        />
        <Button
            text={loading ? "Loading..." : "Login with Google"}
            blue={true}
            onClick={googleAuth}
            disabled={loading}
        />
        <p className='p-login' onClick={() => setFlag(!flag)}>
            Don't have an account ? Click Here.
        </p>

         </form>
        
   

   </div>
  )
}

export default LoginForm