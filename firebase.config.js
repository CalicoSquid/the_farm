import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0cFbtG9JsE7g7_tqSoWxfmgM_H9Mtyg0",
  authDomain: "the-farm-7dc3f.firebaseapp.com",
  projectId: "the-farm-7dc3f",
  storageBucket: "the-farm-7dc3f.firebasestorage.app",
  messagingSenderId: "1070504858423",
  appId: "1:1070504858423:web:b3fcc69e9253bdf0db80b2",
  measurementId: "G-W0GQWP10ZF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
