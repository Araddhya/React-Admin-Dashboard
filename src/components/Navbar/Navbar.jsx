import React, { useState } from 'react'
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { auth } from "../../Firebase/firebase" 
import './Navbar.css'



const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      setTheme('light')
      localStorage.setItem('theme', 'light')
    }
  }

  return [theme, toggleTheme]
}


const Navbar = () => {
  
  const [theme, toggleTheme] = useTheme()
  const handleLogout = () => {
   
    auth.signOut().then(() => { 
      console.log('User signed out')
    }).catch((error) => {
      console.error(error)
    })
  }

  return (
    <div className={`navbar ${theme}`}>
      <div className="container">

      {/* <div className="logo">
          <img src="/logo.jpg" alt="Your Logo" />
        </div> */}

        <div className="right_section">
          <div className="profile">
            <FaUserCircle className="icon" />
            <Link to="/profile" className="link">Profile</Link>
          </div>
          <div className="logout">
            <button onClick={handleLogout} className="button"><span style={{ color: 'white', fontWeight: 'bold' }}>Logout</span></button>
          </div>
          <div className="theme_switcher">
            <button onClick={toggleTheme} className="button">
              {theme === 'light' ? <FaMoon className="icon" style={{ color: 'white' }} /> : <FaSun className="icon"  style={{ color: 'white' }}/>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar