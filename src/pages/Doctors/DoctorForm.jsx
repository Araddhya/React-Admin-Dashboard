import React, { useState } from "react"




const DoctorForm = ({ doctor, onSave, onCancel }) => {
  const [updatedData, setUpdatedData] = useState({
    name: doctor.name || "",
    specialization: doctor.specialization || "",
  
  })

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    onSave(updatedData)
  }

  return (
    <div>
      <h4>{doctor.id ? "Edit Doctor" : "Add New Doctor"}</h4>
      <label>Name:</label>
      <input type="text" name="name" value={updatedData.name} onChange={handleChange} />
      <label>Specialization:</label>
      <input
        type="text"
        name="specialization"
        value={updatedData.specialization}
        onChange={handleChange}
      />
     
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

export default DoctorForm
