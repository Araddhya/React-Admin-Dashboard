import {db} from '../../Firebase/firebase'

import React, { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getDoctorAppointments, addDoctorAppointment, updateDoctorAppointment, deleteDoctorAppointment } from "../../Firebase/appointmentsFirebaseService";
import { notify } from "../../components/Alert/Alert";
import { getPatients } from "../../Firebase/PatientfirebaseService";
import './Appointments.css';

const Appointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAppointment, setNewAppointment] = useState({ patientId: "", dateTime: null });
  const [editMode, setEditMode] = useState(null);
  const [editAppointment, setEditAppointment] = useState({ id: "", patientId: "", dateTime: null });
  const [displayDialog, setDisplayDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doctorAppointments = await getDoctorAppointments(doctorId);
        const patientsList = await getPatients();
        console.log("Patients List:", patientsList); 
        setAppointments(doctorAppointments);
        setPatients(patientsList);
      } catch (error) {
        console.error("Error fetching data: ", error.message);
        notify({
          alert: error.message,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [doctorId]);

  const handleAddAppointment = () => {
    setNewAppointment({ patientId: "", dateTime: null });
    setEditMode(null);
    setDisplayDialog(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditMode(appointment.id);
    setEditAppointment({ ...appointment });
    setDisplayDialog(true);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    setLoading(true);
    try {
      await deleteDoctorAppointment(doctorId, appointmentId);
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
    } catch (error) {
      console.error("Error deleting appointment: ", error.message);
      notify({
        alert: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!newAppointment.patientId || !newAppointment.dateTime) {
        throw new Error("All fields are required.");
      }

      const id = editMode ? editMode : await addDoctorAppointment(doctorId, newAppointment);
      const updatedAppointments = [...appointments];

      if (editMode) {
        const index = updatedAppointments.findIndex(appointment => appointment.id === id);
        updatedAppointments[index] = { ...newAppointment, id };
      } else {
        newAppointment.id = id;
        updatedAppointments.push(newAppointment);
      }

      setAppointments(updatedAppointments);
      setDisplayDialog(false);
    } catch (error) {
      console.error("Error saving appointment: ", error.message);
      notify({
        alert: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayDialog(false);
    setEditMode(null);
    setNewAppointment({ patientId: "", dateTime: null });
    setEditAppointment({ id: "", patientId: "", dateTime: null });
  };

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={appointments.map(appointment => ({
          id: appointment.id,
          title: `Patient: ${appointment.patientName}`,
          start: new Date(appointment.dateTime),
          end: new Date(appointment.dateTime),
        }))}
        eventClick={(info) => handleEditAppointment(appointments.find(appointment => appointment.id === info.event.id))}
      />
      <button className="add-appointment-button" onClick={handleAddAppointment}>Add Appointment</button>

      <Dialog header={editMode ? "Edit Appointment" : "Add New Appointment"} visible={displayDialog} style={{ width: '50vw' }} onHide={handleCancel}>
        <span className="close-button" onClick={handleCancel}>&times;</span>
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
              {patients.map((patient) => (
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
  );
};

export default Appointments;
