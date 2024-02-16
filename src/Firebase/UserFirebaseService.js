import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getUser = async (id) => {
    if(!id) return null
    const user_ref = await getDoc(doc(db, 'users', id));
    return user_ref.data()
}