import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc } from "firebase/firestore";
import {ref, getStorage, uploadBytes } from "firebase/storage";
import { configobj } from './config.js';

const firebaseConfig = {
    apiKey: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_KEY : configobj.REACT_APP_API_KEY, 
    authDomain: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_AUTH_DOMAIN : configobj.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROJECT_ID : configobj.REACT_APP_PROJECT_ID,
    storageBucket: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_STORAGE_BUCKET : configobj.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_MESSAGING_SENDER_ID : configobj.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_APP_ID : configobj.REACT_APP_APP_ID,
};

// Initialize Firebase
export const Firebase = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(Firebase);

export const db = getFirestore(Firebase);

export const storage = getStorage(Firebase);