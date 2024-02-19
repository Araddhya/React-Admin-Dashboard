import React, { useEffect, useState } from "react"
import { getPatients, getPatientsForDoctor, addPatient, updatePatient, deletePatient } from "../../Firebase/PatientfirebaseService"
import { notify } from "../../components/Alert/Alert"
import "./Patients.css"
import { getDoctors } from "../../Firebase/DoctorfirebaseService"
import { createUser } from "../../Firebase/AuthFirebaseService"

const Patients = ({doctorId, role}) => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "", contactNumber: "", selectedDoctor: "" })
  const [editMode, setEditMode] = useState(null)
  const [editPatient, setEditPatient] = useState({ id: "", name: "", age: "", gender: "", contactNumber: "", selectedDoctor: "" })
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      try {
        let patientsList
        if(role === 'doctor') patientsList = await getPatientsForDoctor(doctorId)
        else if (role === 'admin') patientsList = await getPatients(doctorId)
        setPatients(patientsList)
      } catch (error) {
        console.error("Error fetching patients: ", error.message)
        notify({
          alert: error.message,
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  useEffect(() => {
    const func = async () => {
      const docs = await getDoctors()
      setDoctors(docs)
    }
    func()
  }, [])


  const handleAddPatient = async () => {
    setLoading(true)
    try {
      if (!newPatient.name || !newPatient.age || !newPatient.gender || !newPatient.contactNumber || !newPatient.selectedDoctor || !newPatient.email || !newPatient.password) {
        throw new Error("All fields are required.")
      }
      console.log(newPatient)
      let patient_user = await createUser(newPatient.email, newPatient.password)
      newPatient.id = patient_user.user.uid
      const patient = await addPatient(newPatient)
      console.log(patient)
      notify({
        alert: `New patient added with ID: ${patient.id}`,
        type: 'info'
      })

      setNewPatient({ name: "", age: "", gender: "", contactNumber: "", selectedDoctor: "" })
      setPatients(prev => [newPatient, ...prev])
    } catch (error) {
      console.error("Error adding patient: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }
  
  

  const handleEditPatient = async () => {
    try {
      setLoading(true)
      if (!editPatient.name || !editPatient.age || !editPatient.gender || !editPatient.contactNumber) throw new Error("All fields are required.")
      if (role == 'admin' && !editPatient.selectedDoctor) throw new Error("All fields are required.")

      editPatient.id = editMode
      if(role !== 'admin') delete editPatient.selectedDoctor
      const updatedPatients = await Promise.all(patients.map(async (patient) => patient.id === editMode ? await updatePatient(editPatient) : patient))
      setPatients(updatedPatients)
      setEditMode(null)
      setEditPatient({ id: "", name: "", age: "", gender: "", contactNumber: "", selectedDoctor: "" })
    } catch (error) {
      console.error("Error editing patient: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePatient = async (patientId) => {
    setLoading(true)
    try {
      await deletePatient(patientId)
      setPatients(prev => prev.filter(patient => patient.id !== patientId))
    } catch (error) {
      console.error("Error deleting patient: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading patients...</p>
  }

  return (
    <div className="patients-container">
      <h2>Patients</h2>
      <table className="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact Number</th>
            <th>Doctor Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            patients.length
            ? patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.contactNumber}</td>
                <td>{patient.selectedDoctor ? `${patient.selectedDoctor.name} - ${patient.selectedDoctor.specialization || ''}` : 'N/A'}</td>
                <td>
                  <button className="edit-button" onClick={() => setEditMode(patient.id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeletePatient(patient.id)}>Remove</button>
                </td>
              </tr>
            ))
            : <p>No patients assigned to you</p>
          }
        </tbody>
      </table>

      {editMode !== null && (
        <div className="edit-patient-form">
          <h3>Edit Patient</h3>
          <label htmlFor='patient-name' className="form-label">Name:</label>
          <input
            type="text"
            id='patient-name'
            value={editPatient.name}
            onChange={(e) => setEditPatient({ ...editPatient, name: e.target.value })}
            className="form-input"
          />
          <label htmlFor='patient-age' className="form-label">Age:</label>
          <input
            type="text"
            id='patient-age'
            value={editPatient.age}
            onChange={(e) => setEditPatient({ ...editPatient, age: e.target.value })}
            className="form-input"
          />
          <label htmlFor='patient-gender' className="form-label">Gender:</label>
          <input
            type="text"
            id='patient-gender'
            value={editPatient.gender}
            onChange={(e) => setEditPatient({ ...editPatient, gender: e.target.value })}
            className="form-input"
          />
          <label htmlFor='patient-contactNumber' className="form-label">Contact Number:</label>
          <input
            type="text"
            id='patient-contactNumber'
            value={editPatient.contactNumber}
            onChange={(e) => setEditPatient({ ...editPatient, contactNumber: e.target.value })}
            className="form-input"
          />
          
          {
            role === 'admin'
            ? (<>
              <label htmlFor='patient-selected-doctor' className="form-label">Select Doctor:</label>
                <select
                id="patient-selected-doctor"
                value={editPatient.selectedDoctor}
                onChange={(e) => setEditPatient({ ...editPatient, selectedDoctor: e.target.value })}
                className="form-input"
              >
                <option value="" disabled>Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialization}</option>
                ))}
              </select>
            </>)
            : null
          }
          
          <button className="save-button" onClick={handleEditPatient}>Save</button>
        </div>
      )}

      {/* <h3>Add New Patient</h3>
      <label htmlFor='new-patient-name' className="form-label">Name:</label>
      <input
        type="text"
        id="new-patient-name"
        value={newPatient.name}
        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        className="form-input"
      />
      <label htmlFor='new-patient-age' className="form-label">Age:</label>
      <input
        type="text"
        id="new-patient-age"
        value={newPatient.age}
        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
        className="form-input"
      />
      <label htmlFor='new-patient-gender' className="form-label">Gender:</label>
      <input
        type="text"
        id="new-patient-gender"
        value={newPatient.gender}
        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
        className="form-input"
      />
      <label htmlFor='new-patient-contactNumber' className="form-label">Contact Number:</label>
      <input
        type="text"
        id="new-patient-contactNumber"
        value={newPatient.contactNumber}
        onChange={(e) => setNewPatient({ ...newPatient, contactNumber: e.target.value })}
        className="form-input"
      />
      <label htmlFor='new-patient-email' className="form-label">Email:</label>
      <input
        type="text"
        id="new-patient-email"
        value={newPatient.email}
        onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
        className="form-input"
      />
      <label htmlFor='new-patient-password' className="form-label">Password:</label>
      <input
        type="password"
        id="new-patient-password"
        value={newPatient.password}
        onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
        className="form-input"
      />
      <label htmlFor='new-patient-selected-doctor' className="form-label">Select Doctor:</label>
      <select
        id="new-patient-selected-doctor"
        value={newPatient.selectedDoctor}
        onChange={(e) => setNewPatient({ ...newPatient, selectedDoctor: e.target.value })}
        className="form-input"
      >
        <option value="" disabled>Select a doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialization}</option>
        ))}
      </select>
      <button className="add-patient-button" onClick={handleAddPatient}>Add Patient</button> */}
    </div>
  )
}

export default Patients