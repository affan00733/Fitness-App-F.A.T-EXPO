import firebase from 'firebase/app';
import "firebase/auth"
import "firebase/firestore"



// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZSaL3h7bojNRBhIjxtv806EPNzcewXnM",
  authDomain: "kakushin-22610.firebaseapp.com",
  projectId: "kakushin-22610",
  storageBucket: "kakushin-22610.appspot.com",
  messagingSenderId: "964256357136",
  appId: "1:964256357136:web:1bdc535bf410e5d10c6395",
  measurementId: "G-H7FECD51Q9"
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;