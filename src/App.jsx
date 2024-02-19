import React, {  useState, useEffect } from "react"
import {BrowserRouter,  Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux" 
import { SET_USER } from "./Redux/UserStore/index.js"
import { getUser } from "./Firebase/UserFirebaseService.js"

import Admin from './pages/Admin/Admin.jsx'
import Profile from './pages/Profile.jsx'
import Home from "./pages/Home/Home.jsx"
import Login from "./components/Login/Login.jsx"
import Signup from "./components/Signup/Signup.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Patients from "./pages/Patients/Patients.jsx"
import Doctors from "./pages/Doctors/Doctors.jsx"
import Appointments from "./pages/Appointments/Appointments.jsx"
import Alerts from './components/Alert/Alert'
import { auth } from "./Firebase/firebase.jsx"
import { useAuthState } from "react-firebase-hooks/auth"
import "./App.css"



const App = () => {
  const [theme, setTheme] = useState('light')  
  const [user] = useAuthState(auth)
  const profile = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if(!user) return
    const func = async () => {
      const user_data = await getUser(user.uid)
      dispatch(SET_USER(user_data))
    }
    func()
  }, [user])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard theme={theme} user={user} ><Home /></Dashboard> : <Navigate to="/login" />} />
        {/* <Route path="/admin" element={user ? <Dashboard theme={theme} user={user} ><Admin /></Dashboard> : <Navigate to="/login" />} /> */}
        <Route path="/patients" element={
          user
          ? profile?.role === 'patient'
            ? <Navigate to="/dashboard" />
            : <Dashboard theme={theme} user={user} ><Patients doctorId={user.uid} role={profile?.role}/></Dashboard>
          : <Navigate to="/login" />
          } />
        <Route path="/doctors" element={
          user 
          ? profile?.role === 'patient' || profile?.role === 'doctor'
            ? <Navigate to="/dashboard" />
            : <Dashboard theme={theme} user={user} ><Doctors /></Dashboard>
          : <Navigate to="/login" />
        } />
        <Route path="/profile" element={user ? <Dashboard theme={theme} user={user} ><Profile /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/appointments" element={user ? <Dashboard theme={theme} user={user} ><Appointments userId={user.uid} /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Dashboard theme={theme} user={user} ><Home /></Dashboard> : <Navigate to="/login" />} />
      </Routes>
      <Alerts />
    </BrowserRouter>
  )
}

export default App

