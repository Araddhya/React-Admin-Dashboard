import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from './firebase'

export const createUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password)
}