// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-93e83.firebaseapp.com",
  projectId: "mern-estate-93e83",
  storageBucket: "mern-estate-93e83.appspot.com",
  messagingSenderId: "814604160037",
  appId: "1:814604160037:web:5697a6b078926b8107c3cc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
