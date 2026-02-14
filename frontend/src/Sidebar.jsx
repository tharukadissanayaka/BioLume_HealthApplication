import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaMoon, FaSun, FaWater, FaCog } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>BioLume</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/main" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaHome />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/main/sleep" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaMoon />
          <span>Sleep Tracker</span>
        </NavLink>
        <NavLink to="/main/hydration" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaWater />
          <span>Hydration</span>
        </NavLink>
        <NavLink to="/main/activity" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaSun />
          <span>Activity</span>
        </NavLink>
        <NavLink to="/main/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
