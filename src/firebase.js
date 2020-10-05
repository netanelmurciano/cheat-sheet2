import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCAqvbeArPj-WRDsnDB73-SrfWmTRftd4g",
    authDomain: "cheet-sheet.firebaseapp.com",
    databaseURL: "https://cheet-sheet.firebaseio.com",
    projectId: "cheet-sheet",
    storageBucket: "cheet-sheet.appspot.com",
    messagingSenderId: "17304686700",
    appId: "1:17304686700:web:fbd3bdd0e8180f43890849",
    measurementId: "G-HJ3VV2HZTN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;