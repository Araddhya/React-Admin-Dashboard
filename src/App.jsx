import React, {  useState } from "react";
import {BrowserRouter,  Routes, Route, Navigate } from "react-router-dom";

import Admin from './pages/Admin/Admin.jsx';
import Profile from './pages/Profile.jsx';
import Home from "./pages/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients/Patients.jsx";
import Doctors from "./pages/Doctors/Doctors.jsx";
import Appointments from "./pages/Appointments/Appointments.jsx";
import Alerts from './components/Alert/Alert'
import { auth } from "./Firebase/firebase.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";



const App = () => {
  const [theme, setTheme] = useState('light');  
  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Dashboard theme={theme} user={user} ><Home /></Dashboard> : <Login />} />
        <Route path="/signup" element={user ? <Dashboard theme={theme} user={user} ><Home /></Dashboard> : <Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard theme={theme} user={user} ><Home /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/admin" element={user ? <Dashboard theme={theme} user={user} ><Admin /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/patients" element={user ? <Dashboard theme={theme} user={user} ><Patients /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/doctors" element={user ? <Dashboard theme={theme} user={user} ><Doctors /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Dashboard theme={theme} user={user} ><Profile /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/appointments" element={user ? <Dashboard theme={theme} user={user} ><Appointments /></Dashboard> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Dashboard theme={theme} user={user} ><Home /></Dashboard> : <Navigate to="/login" />} />
      </Routes>
      <Alerts />
    </BrowserRouter>
  );
};

export default App;

