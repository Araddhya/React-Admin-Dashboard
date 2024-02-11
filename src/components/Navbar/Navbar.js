import React, { useState } from 'react';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { auth } from "../../firebase"; // import firebaseAuth from firebase.js



// Define a custom hook to get and set the theme from local storage
const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  return [theme, toggleTheme];
};

// Define a Navbar component
const Navbar = () => {
  // Use the custom hook to get and set the theme
  const [theme, toggleTheme] = useTheme();

  // Define a function to handle the logout logic
  const handleLogout = () => {
    // You can use your own authentication logic here
    // For example, using firebase auth
    auth.signOut().then(() => { // use firebaseAuth.signOut() instead of auth.signOut()
      console.log('User signed out');
    }).catch((error) => {
      console.error(error);
    });
  };

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
  );
};

export default Navbar;