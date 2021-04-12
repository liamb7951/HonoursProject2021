import * as firebase from 'firebase';
import 'firebase/firestore';

// The firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCKO_RB20xlUUTyorrSlXooO7QC13FWOsA",
  authDomain: "honours-project-6d968.firebaseapp.com",
  projectId: "honours-project-6d968",
  storageBucket: "honours-project-6d968.appspot.com",
  messagingSenderId: "829222080867",
  appId: "1:829222080867:web:c89a346aa49847d2f90356",
  measurementId: "G-GKMNZS0BN8"
};

// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebaseApp.firestore();

export { firebase, firebaseApp, db };