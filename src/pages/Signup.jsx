import React, { useState } from 'react'
import Header from '../components/Header/Header'
import LoginForm from '../components/SignupSignin/LoginForm';
import SignupForm from '../components/SignupSignin/SignupForm';

const Signup = () => {
    const[flag,setFlag]=useState(false);
    const[loading,setLoading]=useState(false);
  return (
    <>
    <Header/>
    <div className='wrapper'>
    {flag? <LoginForm setFlag={setFlag} flag={flag}/>:<SignupForm setFlag={setFlag} flag={flag}/>}    
    </div>
    </>
    
  )
}

export default Signup