import React from "react"
import ManageDoctors from "../../pages/Doctors/ManageDoctors"
import ViewAppointments from "../../pages/Appointments/ViewAppointments"

const Admin = () => {
  return (
    <div>
      <h2>Admin Panel</h2>
      <ManageDoctors />
      <ViewAppointments />
    </div>
  )
}

export default Admin
