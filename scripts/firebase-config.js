// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEqOKZsmAKE_2sT91729vW9znn4-z4qwg",
  authDomain: "gym-management-system-92bee.firebaseapp.com",
  projectId: "gym-management-system-92bee",
  storageBucket: "gym-management-system-92bee.firebasestorage.app",
  messagingSenderId: "763017929957",
  appId: "1:763017929957:web:9c964f39c196cb55a5200c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Services
const auth = firebase.auth();
const db = firebase.firestore();