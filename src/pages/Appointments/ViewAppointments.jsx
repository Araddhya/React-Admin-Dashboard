import React, { useEffect, useState } from "react";
import { getDoctorAppointments } from "../../Firebase/appointmentsFirebaseService";
import { notify } from "../../components/Alert/Alert";
import "./ViewAppointments.css"


const ViewAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const doctorAppointments = await getDoctorAppointments(doctorId);
        setAppointments(doctorAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error.message);
        notify({
          alert: error.message,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div>
      <h3>View Appointments</h3>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <div>
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id} onClick={() => handleAppointmentClick(appointment)}>
                {`Patient ID: ${appointment.patientId} - Date: ${appointment.dateTime}`}
              </li>
            ))}
          </ul>
          {selectedAppointment && (
            <div>
              <h4>Selected Appointment Details</h4>
              <p>Patient ID: {selectedAppointment.patientId}</p>
              <p>Date: {selectedAppointment.dateTime}</p>
              
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default ViewAppointments;
