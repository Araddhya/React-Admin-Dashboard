import React, { useEffect, useState } from "react"
import { getDoctors, addDoctor, updateDoctor, deleteDoctor} from "../../Firebase/DoctorfirebaseService"
import { notify } from "../../components/Alert/Alert"
import './Doctors.css'
import { useSelector } from "react-redux"
import { createUser } from "../../Firebase/AuthFirebaseService"

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [newDoctor, setNewDoctor] = useState({ name: "", email: "", specialization: "", hospital: "", available: false, experience: 0 })
  const [editMode, setEditMode] = useState(null)
  const [editDoctor, setEditDoctor] = useState({ id: "", name: "", email: "", specialization: "", hospital: "", available: false, experience: 0 })
  const user = useSelector(state => state.user.user)

  useEffect(() => {
    console.log("Doctors component mounted")
    const fetchDoctors = async () => {
      setLoading(true)
      try {
        const doctorsList = await getDoctors()
        console.log("Doctors List:", doctorsList)
        setDoctors(doctorsList)
      } catch (error) {
        console.error("Error fetching doctors: ", error.message)
        notify({
          alert: error.message,
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleAddDoctor = async () => {
    setLoading(true)
    console.log(newDoctor)
    try {
      if (!newDoctor.name || !newDoctor.email || !newDoctor.specialization || !newDoctor.hospital || !newDoctor.password || !(typeof newDoctor.available === 'boolean') || !newDoctor.experience ) {
        throw new Error("All fields are required.")
      }
      console.log(newDoctor)
      //const newDoctorId = await addDoctor(newDoctor)
      let doctor_user = await createUser(newDoctor.email,newDoctor.password)
      newDoctor.id=doctor_user.user.uid
      const doctor=await addDoctor(newDoctor)
      console.log(doctor)
     // newDoctor.id = newDoctorId
      //console.log("New doctor added with ID:", newDoctorId)
      notify({
        alert: `New doctor added with ID: ${doctor.id}`,
        type: 'info'
      })

      setNewDoctor({ name: "", email: "", specialization: "", hospital: "", available: false, experience: 0 })

      setDoctors(prev => [newDoctor, ...prev])
    } catch (error) {
      console.error("Error adding doctor: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditDoctor = async () => {
    try {
      setLoading(true)
      if (!editDoctor.name || !editDoctor.email || !editDoctor.specialization || !editDoctor.hospital ) {
        throw new Error("Name, Email, Specialization, and Hospital are required.")
      }
      editDoctor.id = editMode
      await updateDoctor(editDoctor)
      
      setDoctors(prev => prev.map((doctor) => doctor.id === editMode ? {...doctor, ...editDoctor} : doctor))
      setEditMode(null)
      setEditDoctor({ id: "", name: "", email: "", specialization: "", hospital: "", available: false, experience: 0 })
    } catch (error) {
      console.error("Error editing doctor: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDoctor = async (doctorId) => {
    setLoading(true)
    try {
      await deleteDoctor(doctorId)
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId))
    } catch (error) {
      console.error("Error deleting doctor: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading doctors...</p>
  }

  return (
    <div className="doctors-container">
      {/* {
        user.role == 'doctor'
        ? <h1>DOCTOR</h1>
        : <h1>PATIENT</h1>
      } */}
      <h2>Doctors</h2>
      <table className="doctors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Hospital</th>
            <th>Available</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            doctors.length
            ? doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.hospital}</td>
                <td>{doctor.available ? 'Yes' : 'No'}</td>
                <td>{doctor.experience} years</td>
                <td>
                  <button className="edit-button" onClick={() => setEditMode(doctor.id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
                </td>
              </tr>
            ))
            : <p>No doctors have signed up yet</p>
          }
        </tbody>
      </table>

      {editMode !== null && (
        <div className="edit-doctor-form">
          <h3>Edit Doctor</h3>
          <label htmlFor='doctor-name' className="form-label">Name:</label>
          <input
            type="text"
            id='doctor-name'
            value={editDoctor.name}
            onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
            className="form-input"
          />

          <label htmlFor='doctor-email' className="form-label">Email:</label>
          <input
            type="text"
            id='doctor-email'
            value={editDoctor.email}
            onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
            className="form-input"
          />

          <label htmlFor='doctor-specialization' className="form-label">Specialization:</label>
          <input
            type="text"
            id="doctor-specialization"
            value={editDoctor.specialization}
            onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
            className="form-input"
          />
         
          <label htmlFor='doctor-hospital' className="form-label">Hospital:</label>
          <input
            type="text"
            id="doctor-hospital"
            value={editDoctor.hospital}
            onChange={(e) => setEditDoctor({ ...editDoctor, hospital: e.target.value })}
            className="form-input"
          />

          <label htmlFor='doctor-available' className="form-label">Available:</label>
          <select
            id='doctor-available'
            value={editDoctor.available}
            onChange={(e) => setEditDoctor({ ...editDoctor, available: e.target.value === 'true' })}
            className="form-input"
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>

          <label htmlFor='doctor-experience' className="form-label">Experience (years):</label>
          <input
            type="number"
            id="doctor-experience"
            value={editDoctor.experience}
            onChange={(e) => setEditDoctor({ ...editDoctor, experience: parseInt(e.target.value, 10) })}
            className="form-input"
          />

          <button className="save-button" onClick={handleEditDoctor}>Save</button>
        </div>
      )}

      {/* <h3>Add New Doctor</h3>
      <label htmlFor='new-doctor-name' className="form-label">Name:</label>
      <input
        type="text"
        id="new-doctor-name"
        value={newDoctor.name}
        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        className="form-input"
      />
     <label htmlFor='new-doctor-password' className="form-label">Password:</label>
          <input
            type="password"
            id="new-doctor-password"
            value={newDoctor.password}
            onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
            className="form-input"
     />
      <label htmlFor='new-doctor-email' className="form-label">Email:</label>
      <input
        type="text"
        id="new-doctor-email"
        value={newDoctor.email}
        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
        className="form-input"
      />

      <label htmlFor='new-doctor-specialization' className="form-label">Specialization:</label>
      <input
        type="text"
        id="new-doctor-specialization"
        value={newDoctor.specialization}
        onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
        className="form-input"
      />

      <label htmlFor='new-doctor-hospital' className="form-label">Hospital:</label>
      <input
        type="text"
        id="new-doctor-hospital"
        value={newDoctor.hospital}
        onChange={(e) => setNewDoctor({ ...newDoctor, hospital: e.target.value })}
        className="form-input"
      />

      <label htmlFor='new-doctor-available' className="form-label">Available:</label>
      <select
        id='new-doctor-available'
        value={newDoctor.available}
        onChange={(e) => setNewDoctor({ ...newDoctor, available: e.target.value === 'true' })}
        className="form-input"
      >
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>

      <label htmlFor='new-doctor-experience' className="form-label">Experience (years):</label>
      <input
        type="number"
        id="new-doctor-experience"
        value={newDoctor.experience}
        onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value, 10) })}
        className="form-input"
      />

      <button className="add-doctor-button" onClick={handleAddDoctor}>Add Doctor</button> */}
    </div>
  )
}

export default Doctors
