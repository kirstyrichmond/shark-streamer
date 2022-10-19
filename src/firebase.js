import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQRlhAnCdUOFwt51xCZKlGDsFxhrQynNA",
  authDomain: "netflix-clone-20e8c.firebaseapp.com",
  projectId: "netflix-clone-20e8c",
  storageBucket: "netflix-clone-20e8c.appspot.com",
  messagingSenderId: "834102128725",
  appId: "1:834102128725:web:f8fe9dd6dc1b282036a4dc",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export { auth };
export default db;
