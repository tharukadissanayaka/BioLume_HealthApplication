import React, { useState } from 'react';
import { activityData } from '../utils/mockData';
import './Activity.css';

const ActivityTracker = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activityType, setActivityType] = useState('sunlight');
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAddForm(false);
    setActivityType('sunlight');
    setDuration(30);
  };

  // Format data for the charts
  const sunlightChartData = activityData.sunlight.map((item) => ({
    date: item.date.split('-')[2],
    duration: item.duration,
  }));

  const screenTimeChartData = activityData.screenTime.map((item) => ({
    date: item.date.split('-')[2],
    duration: item.duration,
  }));

  return (
    <div className="activity-container">
      <div className="activity-header">
        <h2>Activity Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="log-activity-btn"
        >
          + Log Activity
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-container">
          <h3>Log Activity</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Activity Type</label>
              <div className="activity-type-buttons">
                <button
                  type="button"
                  onClick={() => setActivityType('sunlight')}
                  className={`type-btn ${activityType === 'sunlight' ? 'active-sunlight' : ''}`}
                >
                  ☀️ Sunlight Exposure
                </button>
                <button
                  type="button"
                  onClick={() => setActivityType('screenTime')}
                  className={`type-btn ${activityType === 'screenTime' ? 'active-screen' : ''}`}
                >
                  📱 Screen Time
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                Duration:{' '}
                {activityType === 'sunlight'
                  ? `${duration} minutes`
                  : `${duration / 60} hours`}
              </label>
              <input
                type="range"
                min={activityType === 'sunlight' ? 5 : 30}
                max={activityType === 'sunlight' ? 120 : 480}
                step={activityType === 'sunlight' ? 5 : 30}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="range-input"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon sunlight-icon">☀️</div>
            <h3>Sunlight Exposure</h3>
          </div>
          <div className="chart-placeholder">
            <p>Chart: Sunlight Exposure Trend</p>
          </div>
          <div className="metric-stats">
            <div className="stat">
              <p className="stat-label">Daily Average</p>
              <p className="stat-value">
                {Math.round(
                  activityData.sunlight.reduce(
                    (acc, item) => acc + item.duration,
                    0,
                  ) / activityData.sunlight.length,
                )}{' '}
                min
              </p>
            </div>
            <div className="stat">
              <p className="stat-label">Target</p>
              <p className="stat-value">30 min</p>
            </div>
            <div className="stat">
              <p className="stat-label">Best Day</p>
              <p className="stat-value">45 min</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon screen-icon">📱</div>
            <h3>Screen Time</h3>
          </div>
          <div className="chart-placeholder">
            <p>Chart: Screen Time Trend</p>
          </div>
          <div className="metric-stats">
            <div className="stat">
              <p className="stat-label">Daily Average</p>
              <p className="stat-value">
                {(
                  activityData.screenTime.reduce(
                    (acc, item) => acc + item.duration,
                    0,
                  ) / activityData.screenTime.length
                ).toFixed(1)}{' '}
                hrs
              </p>
            </div>
            <div className="stat">
              <p className="stat-label">Target</p>
              <p className="stat-value">≤ 2 hrs</p>
            </div>
            <div className="stat">
              <p className="stat-label">Best Day</p>
              <p className="stat-value">2.1 hrs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="benefits-section">
        <h3>Activity Benefits</h3>
        <div className="benefits-grid">
          <div className="benefit-card sunlight-benefit">
            <h4>☀️ Sunlight Benefits</h4>
            <ul>
              <li>✓ Boosts vitamin D production</li>
              <li>✓ Improves mood and reduces depression</li>
              <li>✓ Regulates circadian rhythm for better sleep</li>
              <li>✓ Strengthens immune system function</li>
            </ul>
          </div>
          <div className="benefit-card screen-benefit">
            <h4>📱 Reducing Screen Time Benefits</h4>
            <ul>
              <li>✓ Decreases eye strain and headaches</li>
              <li>✓ Improves sleep quality</li>
              <li>✓ Reduces anxiety and stress</li>
              <li>✓ Increases productivity and focus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
