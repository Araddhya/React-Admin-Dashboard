import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where } from "firebase/firestore"
import { db } from "./firebase"
import { getUser } from './UserFirebaseService'
import { getPatientsForDoctor } from "./PatientfirebaseService"

const APPOINTMENTS = collection(db, "appointments")

const addDoctorAppointment = async (doctorId, appointmentData) => {
  try {
    appointmentData.doctorId = doctorId
    const newAppointmentRef = await addDoc(APPOINTMENTS, appointmentData)
    return newAppointmentRef.id
  } catch (error) {
    console.error("Error adding appointment: ", error.message)
    throw error
  }
}

const getDoctorAppointments = async (doctorId) => {
  try {
    const appointmentsSnapshot = await getDocs(query(APPOINTMENTS, where('doctorId', '==', doctorId)))
    let appointmentsList = appointmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    appointmentsList = await Promise.all(appointmentsList.map(async (appointment) => ({
      ...appointment,
      patientId: await getUser(appointment.patientId),
      doctorId: await getUser(appointment.doctorId)
    })))

    console.log("Appointments List from Firebase:", appointmentsList)
    return appointmentsList
  } catch (error) {
    console.error("Error getting doctor appointments: ", error.message)
    throw error
  }
}

const getPatientAppointments = async (patientId) => {
  try {
    console.log(patientId)
    const appointmentsSnapshot = await getDocs(query(APPOINTMENTS, where('patientId', '==', patientId)))
    console.log(appointmentsSnapshot.docs)
    let appointmentsList = appointmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    appointmentsList = await Promise.all(appointmentsList.map(async (appointment) => ({
      ...appointment,
      patientId: await getUser(appointment.patientId),
      doctorId: await getUser(appointment.doctorId)
    })))

    console.log("Appointments List from Firebase:", appointmentsList)
    return appointmentsList
  } catch (error) {
    console.error("Error getting doctor appointments: ", error.message)
    throw error
  }
}

const updateDoctorAppointment = async (updatedAppointment) => {
  try {
    console.log("Updated Appointment ID:", updatedAppointment.id)
    if (!updatedAppointment.id) {
      throw new Error("Invalid document ID")
    }

    const appointmentRef = doc(APPOINTMENTS, updatedAppointment.id)
    await updateDoc(appointmentRef, updatedAppointment)
    updatedAppointment.patientId = await getUser(updatedAppointment.patientId)
    return updatedAppointment
  } catch (error) {
    console.error("Error updating appointment: ", error.message)
    throw error    
  }
}

const deleteDoctorAppointment = async (doctorId, appointmentId) => {
  try {
    const appointmentRef = doc(APPOINTMENTS, appointmentId)
    await deleteDoc(appointmentRef)
  } catch (error) {
    console.error("Error deleting appointment: ", error.message)
    throw error
  }
}

// export const getEnhancedDoctorAppointments = async (doctorId) => {
//   try {
//     const doctorAppointments = await getDoctorAppointments(doctorId)
//     const patientsList = await getPatientsForDoctor()

//     const enhancedAppointments = doctorAppointments.map(appointment => {
//       const patient = patientsList.find(patient => patient.id === appointment.patientId)
//       return {
//         ...appointment,
//         patientName: patient ? patient.name : "Unknown Patient",
       
//       }
//     })
//     return enhancedAppointments
//   }
//   catch (error) {
//     throw error
//   }
// }
export { addDoctorAppointment, getPatientAppointments, getDoctorAppointments, updateDoctorAppointment, deleteDoctorAppointment }
