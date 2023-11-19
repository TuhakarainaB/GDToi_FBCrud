//ToiGD
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // #1 for storing images
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzHgEHX306UwUTG_l7wx5ZTkbEvTvrKio",
  authDomain: "simple-react-crud-app.firebaseapp.com",
  projectId: "simple-react-crud-app",
  storageBucket: "simple-react-crud-app.appspot.com",
  messagingSenderId: "448421395492",
  appId: "1:448421395492:web:7fe80280c391762000ecb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);