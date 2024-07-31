// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApMGju4FYS_2npCsbpnZ-gtfs0V8tuEyI",
  authDomain: "inventory-management-9654f.firebaseapp.com",
  projectId: "inventory-management-9654f",
  storageBucket: "inventory-management-9654f.appspot.com",
  messagingSenderId: "942183275989",
  appId: "1:942183275989:web:c0bdb149a90b3a5a61b15c",
  measurementId: "G-HZSTHW74YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}