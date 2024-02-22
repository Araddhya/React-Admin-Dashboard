import { initializeApp } from "firebase/app"
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
}
console.log(process.env)
console.log(firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig)


// Initialize Auth
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

export { app, auth, db }