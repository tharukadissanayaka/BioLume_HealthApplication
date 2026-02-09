import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import SleepTracker from './SleepTracker';
import Hydration from './Hydration';
import Activity from './Activity';
import Settings from './Settings';
import { Routes, Route } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sleep" element={<SleepTracker />} />
          <Route path="/hydration" element={<Hydration />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
