import React, { useEffect, useState } from "react";
import { getDoctors, updateDoctor, deleteDoctor } from "../../Firebase/DoctorfirebaseService";
import DoctorForm from "./DoctorForm";
import { notify } from "../../components/Alert/Alert";
import './ManageDoctors.css'

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDoctorsList = async () => {
      setLoading(true);
      try {
        const doctorsList = await getDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors: ", error.message);
        notify({
          alert: error.message,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsList();
  }, []);

  const handleEditDoctor = async (doctorId, updatedDoctorData) => {
    setLoading(true);
    try {
      await updateDoctor(doctorId, updatedDoctorData);
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === doctorId ? { ...doctor, ...updatedDoctorData } : doctor
      );
      setDoctors(updatedDoctors);
      setEditMode(null);
      notify({
        alert: "Doctor updated successfully",
        type: 'info'
      });
    } catch (error) {
      console.error("Error updating doctor: ", error.message);
      notify({
        alert: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    setLoading(true);
    try {
      await deleteDoctor(doctorId);
      const updatedDoctors = doctors.filter((doctor) => doctor.id !== doctorId);
      setDoctors(updatedDoctors);
      notify({
        alert: "Doctor deleted successfully",
        type: 'info'
      });
    } catch (error) {
      console.error("Error deleting doctor: ", error.message);
      notify({
        alert: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filteredDoctors = await getDoctors({ search: searchQuery });
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error("Error searching doctors: ", error.message);
      notify({
        alert: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Manage Doctors</h3>
      <div>
        <input
          type="text"
          placeholder="Search Doctors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              {doctor.name} - {doctor.specialization}
              <button onClick={() => setEditMode(doctor.id)}>Edit</button>
              <button onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
              {editMode === doctor.id && (
                <DoctorForm
                  doctor={doctor}
                  onSave={(updatedDoctorData) => handleEditDoctor(doctor.id, updatedDoctorData)}
                  onCancel={() => setEditMode(null)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageDoctors;
