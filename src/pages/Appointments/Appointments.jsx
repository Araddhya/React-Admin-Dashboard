import {db} from '../../Firebase/firebase'

import React, { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Dialog } from 'primereact/dialog'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { getPatientAppointments, getDoctorAppointments, addDoctorAppointment, updateDoctorAppointment, deleteDoctorAppointment } from "../../Firebase/appointmentsFirebaseService"
import { notify } from "../../components/Alert/Alert"
import { getPatientsForDoctor } from "../../Firebase/PatientfirebaseService"
import { getDoctors } from "../../Firebase/DoctorfirebaseService"
import './Appointments.css'

const Appointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [newAppointment, setNewAppointment] = useState({ patientId: "", dateTime: null })
  const [editMode, setEditMode] = useState(null)
  const [editAppointment, setEditAppointment] = useState({ id: "", patientId: "", dateTime: null })
  const [displayDialog, setDisplayDialog] = useState(false)
  const [id, setId] = useState(userId)
  const [doctors, setDoctors] = useState([])
  const profile = useSelector(state => state.user.user)

  useEffect(() => {
    const func = async () => {
      if(profile.role !== 'admin') return
      setDoctors(await getDoctors())     
    }
    func()
  }, [profile])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let doctorAppointments
        let patientsList
        if(profile.role === 'doctor' || profile.role === 'admin') {
          doctorAppointments = await getDoctorAppointments(id)
          patientsList = await getPatientsForDoctor(id)
        }
        else if(profile.role === 'patient') doctorAppointments = await getPatientAppointments(id)
        setAppointments(doctorAppointments)
        setPatients(patientsList)
      } catch (error) {
        console.error("Error fetching data: ", error.message)
        notify({
          alert: error.message,
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
  }, [id])

  const handleAddAppointment = () => {
    if(profile.role === 'patient') return
    setNewAppointment({ patientId: "", dateTime: null })
    setEditMode(null)
    setDisplayDialog(true)
  }
  
  const handleEditAppointment = (appointment) => {
    if(profile.role === 'patient') return
    setEditMode(appointment.id)
    setEditAppointment({ ...appointment })
    setDisplayDialog(true)
  }
  
  const handleDeleteAppointment = async (appointmentId) => {
    if(profile.role === 'patient') return
    setLoading(true)
    try {
      await deleteDoctorAppointment(id, appointmentId)
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId))
    } catch (error) {
      console.error("Error deleting appointment: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleSave = async () => {
    if(profile.role === 'patient') return
    let apmnt = {...newAppointment}
    setLoading(true)
    try {
      if (!apmnt.patientId || !apmnt.dateTime) {
        throw new Error("All fields are required.")
      }
      
      if(editMode) apmnt.id = editMode
      else {
        apmnt.id = await addDoctorAppointment(id, apmnt)
      }
      let updatedAppointments = [...appointments]
      console.log(updatedAppointments)
      if (!editMode) {
        updatedAppointments.push(apmnt)
      }
      
      updatedAppointments = await Promise.all(updatedAppointments.map(async appointment => appointment.id === apmnt.id ? await updateDoctorAppointment(apmnt) : appointment))
      console.log(updatedAppointments)
      setAppointments(updatedAppointments)
      setDisplayDialog(false)
    } catch (error) {
      console.error("Error saving appointment: ", error.message)
      notify({
        alert: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setDisplayDialog(false)
    setEditMode(null)
    setNewAppointment({ patientId: "", dateTime: null })
    setEditAppointment({ id: "", patientId: "", dateTime: null })
  }

  if (loading) {
    return <p>Loading appointments...</p>
  }

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      {
        profile.role === 'admin'
        ? (<select onChange={(e) => setId(e.target.value)} >
          <option value='all'>select doctor</option>
          {doctors?.map(doctor => <option value={doctor.id} key={doctor.id} >{doctor.name}</option>)}
        </select>)
        : null
      }
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={appointments?.map(appointment => ({
          id: appointment.id,
          title: `Patient: ${appointment.patientId.name}`,
          start: new Date(appointment.dateTime),
          end: new Date(appointment.dateTime),
        }))}
        eventClick={(info) => handleEditAppointment(appointments.find(appointment => appointment.id === info.event.id))}
      />
      {
        profile.role === 'patient'
        ? null
        : <button className="add-appointment-button" onClick={handleAddAppointment}>Add Appointment</button>
      }

      <Dialog header={editMode ? "Edit Appointment" : "Add New Appointment"} visible={displayDialog} style={{ width: '50vw' }} onHide={handleCancel}>
        <span className="close-button" onClick={handleCancel}>&times</span>
        <div className="dialog-form">
          <div>
            <label htmlFor='appointment-patient'>Select Patient:</label>
            <select
              id="appointment-patient"
              value={newAppointment.patientId}
              onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
              className="form-input"
            >
              <option value="" disabled>Select a patient</option>
              {patients?.map((patient) => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='appointment-date-time'>Date and Time:</label>
            <input type="datetime-local" id='appointment-date-time' value={newAppointment.dateTime} onChange={(e) => setNewAppointment({ ...newAppointment, dateTime: e.target.value })} />
          </div>
          <div className="button-group">
            <button onClick={handleSave}>{editMode ? "Save" : "Add"}</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default Appointments
