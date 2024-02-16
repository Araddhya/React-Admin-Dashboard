import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import {getUser} from './UserFirebaseService'

const PATIENTS = collection(db, "users");


const addPatient = async (patientData) => {
  try {
    patientData.role = 'patient'
    await setDoc(doc(PATIENTS, patientData.id), patientData);
    return patientData
  } catch (error) {
    console.error("Error adding patient: ", error.message);
    throw error;
  }
};

// const addPatient = async (patientData) => {
//   try {
//     patientData.role = 'patient';

//     if (!patientData.id) {
      
//       const newPatientRef = await addDoc(PATIENTS, patientData);
//       patientData.id = newPatientRef.id;
//     } else {
      
//       const patientRef = doc(PATIENTS, patientData.id);
//       await setDoc(patientRef, patientData);
//     }

//     return patientData;
//   } catch (error) {
//     console.error("Error adding patient: ", error.message);
//     throw error;
//   }
// };



const getPatients = async () => {
  try {
    const patientsSnapshot = await getDocs(query(PATIENTS, where('role', '==', 'patient')));
    let patientsList = patientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    patientsList = await Promise.all(patientsList.map(async (patient) => ({
      ...patient,
      selectedDoctor: await getUser(patient.selectedDoctor)
    })))

    console.log("Patients List from Firebase:", patientsList);
    return patientsList;
  } catch (error) {
    console.error("Error fetching patients: ", error.message);
    throw error;
  }
};

const updatePatient = async (updatedPatient) => {
  try {
    console.log("Updated Patient ID:", updatedPatient.id);
    if (!updatedPatient.id) {
      throw new Error("Invalid document ID");
    }

    const patientRef = doc(PATIENTS, updatedPatient.id);
    return await updateDoc(patientRef, updatedPatient);
  } catch (error) {
    console.error("Error updating patient: ", error.message);
    throw error;
  }
};

const deletePatient = async (patientId) => {
  try {
    const patientRef = doc(PATIENTS, patientId);
    await deleteDoc(patientRef);
  } catch (error) {
    console.error("Error deleting patient: ", error.message);
    throw error;
  }
};

export { addPatient, getPatients, updatePatient, deletePatient };
