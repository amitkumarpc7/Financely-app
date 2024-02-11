// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore,doc,setDoc} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyArZNcJjnYlzgpgU4fUazXElL3ThiByVR8",
  authDomain: "financely-55a71.firebaseapp.com",
  projectId: "financely-55a71",
  storageBucket: "financely-55a71.appspot.com",
  messagingSenderId: "360732938848",
  appId: "1:360732938848:web:2d57157e787f98d50f2905",
  measurementId: "G-SKS6P93TF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics=getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};
