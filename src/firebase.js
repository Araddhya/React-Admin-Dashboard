import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6a2fcxyxDmOHI08P2l71_txWioZ9si5c",
  authDomain: "fir-auth-111-cbbca.firebaseapp.com",
  projectId: "fir-auth-111-cbbca",
  storageBucket: "fir-auth-111-cbbca.appspot.com",
  messagingSenderId: "389065020019",
  appId: "1:389065020019:web:75301f14c2fc06ef395006",
  measurementId: "G-TVGR211K3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);
export {app,auth};
