import React, { useState } from 'react';
import { MoonIcon, PlusIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { sleepData } from './utils/mockData';
import './SleepTracker.css';

const SleepTracker = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeupTime, setWakeupTime] = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState(80);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the sleep data
    console.log('Submitting sleep data:', { bedtime, wakeupTime, sleepQuality });
    setShowAddForm(false);
    // Reset form
    setBedtime('23:00');
    setWakeupTime('07:00');
    setSleepQuality(80);
  };

  // Format data for the chart
  const chartData = sleepData.map((item) => ({
    date: item.date.split('-')[2],
    duration: item.duration,
  }));

  const getQualityClass = (quality) => {
    if (quality >= 80) return 'good';
    if (quality >= 60) return 'medium';
    return 'poor';
  };

  return (
    <div className="sleep-tracker-container">
      <div className="header">
        <h2 className="header-title">Sleep Tracking</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="log-sleep-btn"
        >
          <PlusIcon className="icon" />
          Log Sleep
        </button>
      </div>

      {showAddForm && (
        <div className="card add-form">
          <h3 className="card-title">
            Log Your Sleep
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label className="form-label">
                  Bedtime
                </label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">
                  Wake-up Time
                </label>
                <input
                  type="time"
                  value={wakeupTime}
                  onChange={(e) => setWakeupTime(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="form-label">
                  Sleep Quality: {sleepQuality}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                  className="form-range"
                />
              </div>
              <div className="col-span-2 form-actions">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">
          Sleep Duration (Last 7 Days)
        </h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => [`${value} hours`, 'Duration']}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#00a896"
                strokeWidth={2}
                dot={{
                  fill: '#00a896',
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Sleep Log</h3>
        <div className="sleep-log-table-container">
          <table className="sleep-log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration</th>
                <th>Quality</th>
                <th>Bedtime</th>
                <th>Wake-up</th>
              </tr>
            </thead>
            <tbody>
              {sleepData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.duration} hrs</td>
                  <td>
                    <div className="quality-bar-container">
                      <div className="quality-bar-wrapper">
                        <div
                          className={`quality-bar ${getQualityClass(item.quality)}`}
                          style={{
                            width: `${item.quality}%`,
                          }}
                        ></div>
                      </div>
                      <span className="quality-text">
                        {item.quality}%
                      </span>
                    </div>
                  </td>
                  <td>{item.bedtime}</td>
                  <td>{item.wakeup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          Sleep Insights
        </h3>
        <div className="insights-grid">
          <div className="insight-card blue">
            <div className="insight-header">
              <div className="insight-icon-wrapper blue">
                <MoonIcon className="insight-icon blue" />
              </div>
              <h4 className="insight-title">
                Average Duration
              </h4>
            </div>
            <p className="insight-value">7.3 hrs</p>
            <p className="insight-period">Last 7 days</p>
          </div>
          <div className="insight-card purple">
            <div className="insight-header">
              <div className="insight-icon-wrapper purple">
                <MoonIcon className="insight-icon purple" />
              </div>
              <h4 className="insight-title">
                Average Quality
              </h4>
            </div>
            <p className="insight-value">81.4%</p>
            <p className="insight-period">Last 7 days</p>
          </div>
          <div className="insight-card green">
            <div className="insight-header">
              <div className="insight-icon-wrapper green">
                <MoonIcon className="insight-icon green" />
              </div>
              <h4 className="insight-title">
                Best Sleep Day
              </h4>
            </div>
            <p className="insight-value">Saturday</p>
            <p className="insight-period">8.2 hours, 90% quality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;