import React from 'react';
import './Dashboard.css';
import { healthScoreData, metricData, weeklyScoreData } from './utils/mockData';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid-top">
        <div className="health-score-section">
          <div className="health-score-card">
            <p className="score-label">Score</p>
            <h2 className="score-value">{healthScoreData.today}</h2>
            <p className="score-change">
              {healthScoreData.today > healthScoreData.yesterday ? '↑' : '↓'}{' '}
              {Math.abs(healthScoreData.today - healthScoreData.yesterday)} from yesterday
            </p>
          </div>
        </div>

        <div className="weekly-chart-section">
          <h3>Weekly Health Score</h3>
          <div className="chart-placeholder">
            <p>Weekly Score Trend Chart</p>
          </div>
        </div>
      </div>

      <h3 className="metrics-title">Today's Metrics</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon sleep-icon">😴</div>
          <h4>Sleep</h4>
          <p className="metric-value">{metricData.sleep.value}</p>
          <p className="metric-unit">{metricData.sleep.unit}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${metricData.sleep.progress}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {metricData.sleep.progress}% of {metricData.sleep.target}
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-icon hydration-icon">💧</div>
          <h4>Hydration</h4>
          <p className="metric-value">{metricData.hydration.value}</p>
          <p className="metric-unit">{metricData.hydration.unit}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${metricData.hydration.progress}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {metricData.hydration.progress}% of {metricData.hydration.target}
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-icon sunlight-icon">☀️</div>
          <h4>Sunlight</h4>
          <p className="metric-value">{metricData.sunlight.value}</p>
          <p className="metric-unit">{metricData.sunlight.unit}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${metricData.sunlight.progress}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {metricData.sunlight.progress}% of {metricData.sunlight.target}
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-icon screen-icon">📱</div>
          <h4>Screen Time</h4>
          <p className="metric-value">{metricData.screenTime.value}</p>
          <p className="metric-unit">{metricData.screenTime.unit}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${metricData.screenTime.progress}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {metricData.screenTime.progress}% of {metricData.screenTime.target}
          </p>
        </div>
      </div>

      <div className="tips-section">
        <h3>Tips to Improve Your Score</h3>
        <ul className="tips-list">
          <li className="tip-item">
            <div className="tip-number">1</div>
            <p>Try to go to bed 30 minutes earlier tonight to improve your sleep duration.</p>
          </li>
          <li className="tip-item">
            <div className="tip-number">2</div>
            <p>Drink a glass of water before each meal to increase your hydration.</p>
          </li>
          <li className="tip-item">
            <div className="tip-number">3</div>
            <p>Take a 10-minute walk outside during lunch to increase your sunlight exposure.</p>
          </li>
          <li className="tip-item">
            <div className="tip-number">4</div>
            <p>Enable screen time limits on your devices to reduce digital eye strain.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
