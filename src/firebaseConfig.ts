// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG0UpenQK8--auopmg2FT5f_rzb2BYaSE",
  authDomain: "mydrobe-49fba.firebaseapp.com",
  projectId: "mydrobe-49fba",
  storageBucket: "mydrobe-49fba.firebasestorage.app",
  messagingSenderId: "221380179736",
  appId: "1:221380179736:web:563acd76168f759db3906d",
  measurementId: "G-E46L6GPRJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth }; // Export auth to use in other parts of the app