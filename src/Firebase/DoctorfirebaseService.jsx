import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import axios  from 'axios';


const addDoctor = async (doctorData) => {
  try {
    const doctorsRef = collection(db, "users");
    doctorData.role = 'doctor'
    await setDoc(doc(doctorsRef, doctorData.id), doctorData);
    return doctorData
  } catch (error) {
    console.error("Error adding doctor: ", error.message);
    throw error;
  }
};

const getDoctors = async () => {
  try {
    const doctorsRef = collection(db, "users");
    const doctorsSnapshot = await getDocs(query(doctorsRef, where('role', '==', 'doctor')));    
    const doctorsList = doctorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Doctors List from Firebase:", doctorsList);
    
    return doctorsList;
  } catch (error) {
    console.error("Error fetching doctors: ", error.message);
    throw error;
  }
};


const updateDoctor = async (updatedDoctor) => {
  try {
    console.log("Updated Doctor ID:", updatedDoctor.id);
    if (!updatedDoctor.id) {
      throw new Error("document ID not present");
    }
    const doctorRef = doc(db, "users", updatedDoctor.id);
    await updateDoc(doctorRef, updatedDoctor);
  } catch (error) {
    console.error("Error updating doctor: ", error.message);
    throw error;
  }
};


const deleteDoctor = async (doctorId) => {
  try {
    const doctorRef = doc(db, "users", doctorId);
    await deleteDoc(doctorRef);
  } catch (error) {
    console.error("Error deleting doctor: ", error.message);
    throw error;
  }
};


const DOCTOR = collection(db, "doctors")
export const getDoctor = async (ref) => {
  if(!ref) return null
  try{
    const doctor= await getDocs(ref)
    return{
      ...doctor.data()
    }
  }
  catch(e){
    console.log('Error getting doctor', e.message)
    return 0;
  }
}


export { addDoctor, updateDoctor, deleteDoctor ,getDoctors};




