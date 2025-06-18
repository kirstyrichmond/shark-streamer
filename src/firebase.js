import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQRlhAnCdUOFwt51xCZKlGDsFxhrQynNA",
  authDomain: "netflix-clone-20e8c.firebaseapp.com",
  projectId: "netflix-clone-20e8c",
  storageBucket: "netflix-clone-20e8c.appspot.com",
  messagingSenderId: "834102128725",
  appId: "1:834102128725:web:f8fe9dd6dc1b282036a4dc",
};

// Initialize Firebase only if it hasn't been initialized
let firebaseApp;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app(); // Use the existing app
}

// Set persistence to SESSION for better user experience
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .catch((error) => {
    console.error("Firebase persistence error:", error);
  });

// Get references to auth and firestore
const db = firebaseApp.firestore();
const auth = firebase.auth();

// Debug logging for auth state changes
auth.onAuthStateChanged((user) => {
  console.log("Firebase auth state changed:", user ? `User logged in: ${user.email}` : "User logged out");
});

export { auth };
export default db;