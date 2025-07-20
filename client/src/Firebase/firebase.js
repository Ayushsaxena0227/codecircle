import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCIGtZgs8SV1ovlE1HsSUhr2Gt9Vcph9Dk",
  authDomain: "codecircle-cd228.firebaseapp.com",
  projectId: "codecircle-cd228",
  storageBucket: "codecircle-cd228.firebasestorage.app",
  messagingSenderId: "190182095419",
  appId: "1:190182095419:web:1e62304926d4a80df4ba1e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
