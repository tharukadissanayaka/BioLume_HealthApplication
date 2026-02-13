import React, { useState } from 'react';
import { SunIcon, SmartphoneIcon, PlusIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { activityData } from './utils/mockData';
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

  const sunlightChartData = activityData.sunlight.map((item) => ({
    date: item.date.split('-')[2],
    duration: item.duration,
  }));

  const screenTimeChartData = activityData.screenTime.map((item) => ({
    date: item.date.split('-')[2],
    duration: item.duration,
  }));

  return (
    <div className="activity-tracker">
      <div className="activity-header">
        <h2>Activity Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="log-activity-btn"
        >
          <PlusIcon className="btn-icon" />
          Log Activity
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
                  <SunIcon className="type-icon" />
                  Sunlight Exposure
                </button>
                <button
                  type="button"
                  onClick={() => setActivityType('screenTime')}
                  className={`type-btn ${activityType === 'screenTime' ? 'active-screen' : ''}`}
                >
                  <SmartphoneIcon className="type-icon" />
                  Screen Time
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
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
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
            <div className="metric-icon sunlight-icon">
              <SunIcon />
            </div>
            <h3>Sunlight Exposure</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sunlightChartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 60]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value) => [`${value} min`, 'Duration']}
                />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{
                    fill: '#f59e0b',
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-stats">
            <div className="stat sunlight-stat">
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
            <div className="stat sunlight-stat">
              <p className="stat-label">Target</p>
              <p className="stat-value">30 min</p>
            </div>
            <div className="stat sunlight-stat">
              <p className="stat-label">Best Day</p>
              <p className="stat-value">45 min</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon screen-icon">
              <SmartphoneIcon />
            </div>
            <h3>Screen Time</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={screenTimeChartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 6]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value) => [`${value} hrs`, 'Duration']}
                />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#6b7280"
                  strokeWidth={2}
                  dot={{
                    fill: '#6b7280',
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-stats">
            <div className="stat screen-stat">
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
            <div className="stat screen-stat">
              <p className="stat-label">Target</p>
              <p className="stat-value">≤ 2 hrs</p>
            </div>
            <div className="stat screen-stat">
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
            <h4>
              <SunIcon className="benefit-icon" />
              Sunlight Benefits
            </h4>
            <ul>
              <li>
                <span className="check-circle sunlight-check">✓</span>
                <span>Boosts vitamin D production</span>
              </li>
              <li>
                <span className="check-circle sunlight-check">✓</span>
                <span>Improves mood and reduces depression</span>
              </li>
              <li>
                <span className="check-circle sunlight-check">✓</span>
                <span>Regulates circadian rhythm for better sleep</span>
              </li>
              <li>
                <span className="check-circle sunlight-check">✓</span>
                <span>Strengthens immune system function</span>
              </li>
            </ul>
          </div>
          <div className="benefit-card screen-benefit">
            <h4>
              <SmartphoneIcon className="benefit-icon" />
              Reducing Screen Time Benefits
            </h4>
            <ul>
              <li>
                <span className="check-circle screen-check">✓</span>
                <span>Decreases eye strain and headaches</span>
              </li>
              <li>
                <span className="check-circle screen-check">✓</span>
                <span>Improves sleep quality</span>
              </li>
              <li>
                <span className="check-circle screen-check">✓</span>
                <span>Reduces anxiety and stress</span>
              </li>
              <li>
                <span className="check-circle screen-check">✓</span>
                <span>Increases productivity and focus</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
