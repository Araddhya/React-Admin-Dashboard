import React, { useState } from 'react';
import { FaHome,FaBars,FaUser,FaUserInjured,FaUserMd,FaCalendarCheck}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import './Sidebar.module.css'

const Sidebar = ({ children, setMenuItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const menuItem = [
        { path: '/', name: 'Dashboard', icon: <FaHome /> },
        { path: '/admin', name: 'Admin', icon: <FaUser /> },
        { path: '/patients', name: 'Patients', icon: <FaUserInjured /> },
        { path: '/doctors', name: 'Doctors', icon: <FaUserMd /> },
        { path: '/appointments', name: 'Appointments', icon: <FaCalendarCheck /> }
      ];

         
    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 className="'logo" style={{display: isOpen ? "block" : "none"}} >Logo</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeClassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;