import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Today's Health Score</h1>
      <div className="score-card">
        <p>Your score is</p>
        <h2>85</h2>
      </div>

      <h2>Weekly Health Score</h2>
      <div className="weekly-score">
        {/* Placeholder for weekly score chart */}
        <p>Chart will be here</p>
      </div>

      <h2>Today's Metrics</h2>
      <div className="metrics">
        <div className="metric">
          <h4>Sleep</h4>
          <p>7h 30m</p>
        </div>
        <div className="metric">
          <h4>Hydration</h4>
          <p>1.5L</p>
        </div>
        <div className="metric">
          <h4>Screen Time</h4>
          <p>4h 15m</p>
        </div>
        <div className="metric">
          <h4>Sleep Time</h4>
          <p>10:30 PM</p>
        </div>
      </div>

      <h2>Tips to Improve Your Score</h2>
      <div className="tips">
        <ul>
          <li>Drink more water</li>
          <li>Get at least 8 hours of sleep</li>
          <li>Take a 15-minute walk</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
