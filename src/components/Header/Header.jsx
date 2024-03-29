import React,{useEffect} from 'react'
import './Header.css'
import {useNavigate} from "react-router-dom"
// firebase imports
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from '../../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from "../../assets/user.svg";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate=useNavigate();
  // to check if user is logged in
  useEffect(()=>{
    if(user){
      navigate('/dashboard');
    }

  },[user,loading]);

// Using firebase signout function
    function logoutFnc(){
      try{
        signOut(auth).then(() => {
          // Sign-out successful.
          toast.success("Successfully Logged Out")
          navigate('/');
        }).catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
      }
      catch(e){
        toast.error(e.message);
      }   
    }
    
  return (
    <div className='navbar'>
        <p className='logo'> Financely.</p>
        {user && (
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <img 
            src={user.photoURL?user.photoURL:userImg}
            style={{borderRadius:"50%",height:"2rem",width:"2rem"}}/>
          <p className='logo link' onClick={logoutFnc}>Logout</p>
          </div>
        )}
    </div>
  )
}
 
export default Header