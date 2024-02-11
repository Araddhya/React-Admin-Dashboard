import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import Doctors from "./pages/Doctors.jsx";
import Appointments from "./pages/Appointments.jsx";
import Sidebar from './components/Sidebar/Sidebar.js';
import Navbar from './components/Navbar/Navbar.js';
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState('light');
  const [user, loading, error] = useAuthState(auth);

  
  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to login by default */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? (
            <>
              <Navbar theme={theme} user={user} logout={handleLogout} />
              <Sidebar>
                <Routes>
                 <Route index element={<Home />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/appointments" element={<Appointments />} />
                  
                </Routes>
              </Sidebar>
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

