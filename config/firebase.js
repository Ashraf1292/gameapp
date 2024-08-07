// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFlLsq8F5DGEcXc9PXR0JGLGwUsMFN3eE",
  authDomain: "react-game-4c8fc.firebaseapp.com",
  projectId: "react-game-4c8fc",
  storageBucket: "react-game-4c8fc.appspot.com",
  messagingSenderId: "831968483727",
  appId: "1:831968483727:web:55e1e79757a2ee5338d3fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);