import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { getUser } from './UserFirebaseService';

const APPOINTMENTS = collection(db, "appointments");

const addDoctorAppointment = async (doctorId, appointmentData) => {
  try {
    appointmentData.doctorId = doctorId;
    const newAppointmentRef = await addDoc(APPOINTMENTS, appointmentData);
    return newAppointmentRef.id;
  } catch (error) {
    console.error("Error adding appointment: ", error.message);
    throw error;
  }
};

const getDoctorAppointments = async (doctorId) => {
  try {
    const appointmentsSnapshot = await getDocs(query(APPOINTMENTS, where('doctorId', '==', doctorId)));
    let appointmentsList = appointmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    appointmentsList = await Promise.all(appointmentsList.map(async (appointment) => ({
      ...appointment,
      selectedPatient: await getUser(appointment.selectedPatient)
    })));

    console.log("Appointments List from Firebase:", appointmentsList);
    return appointmentsList;
  } catch (error) {
    console.error("Error getting doctor appointments: ", error.message);
    throw error;
  }
};

const updateDoctorAppointment = async (doctorId, updatedAppointment) => {
  try {
    console.log("Updated Appointment ID:", updatedAppointment.id);
    if (!updatedAppointment.id) {
      throw new Error("Invalid document ID");
    }

    const appointmentRef = doc(APPOINTMENTS, updatedAppointment.id);
    return await updateDoc(appointmentRef, updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment: ", error.message);
    throw error;
  }
};

const deleteDoctorAppointment = async (doctorId, appointmentId) => {
  try {
    const appointmentRef = doc(APPOINTMENTS, appointmentId);
    await deleteDoc(appointmentRef);
  } catch (error) {
    console.error("Error deleting appointment: ", error.message);
    throw error;
  }
};

export { addDoctorAppointment, getDoctorAppointments, updateDoctorAppointment, deleteDoctorAppointment };
