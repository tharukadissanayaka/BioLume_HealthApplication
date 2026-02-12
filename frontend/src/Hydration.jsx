import React, { useState } from 'react'
import { DropletIcon, PlusIcon } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { hydrationData } from './utils/mockData'
import './Hydration.css'

const Hydration = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [waterAmount, setWaterAmount] = useState(0.25)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save the hydration data
    setShowAddForm(false)
    // Reset form
    setWaterAmount(0.25)
  }

  const chartData = hydrationData.map((item) => ({
    date: item.date.split('-')[2],
    amount: item.amount,
  }))

  const dailyTarget = 2.5
  const todayAmount = hydrationData[hydrationData.length - 1].amount
  const progress = Math.round((todayAmount / dailyTarget) * 100)

  const waterOptions = [0.25, 0.5, 0.75, 1]

  return (
    <div className="hydration-container">
      <div className="hydration-header">
        <h2 className="hydration-title">Hydration Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="log-water-btn"
        >
          <PlusIcon className="icon" />
          Log Water
        </button>
      </div>

      {showAddForm && (
        <div className="card hydration-add-form">
          <h3 className="card-title">Log Water Intake</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-stack">
              <div>
                <label className="form-label">Amount (L)</label>
                <div className="water-options">
                  {waterOptions.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setWaterAmount(amount)}
                      className={`water-option-btn${waterAmount === amount ? ' is-selected' : ''}`}
                    >
                      {amount} L
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="hydration-grid">
        <div className="card progress-card">
          <h3 className="card-title">Today's Progress</h3>
          <div className="progress-content">
            <div className="progress-ring">
              <svg className="progress-svg" viewBox="0 0 100 100">
                <circle
                  className="progress-bg"
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className="progress-value"
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray={`${(2 * Math.PI * 45 * progress) / 100} ${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  strokeDashoffset={2 * Math.PI * 45 * 0.25}
                />
                <path
                  d="M50,25 C50,25 65,50 65,65 C65,80 35,80 35,65 C35,50 50,25 50,25 Z"
                  className="progress-drop"
                />
              </svg>
              <div className="progress-center">
                <span className="progress-amount">{todayAmount}</span>
                <span className="progress-target">/ {dailyTarget} L</span>
              </div>
            </div>
            <p className="progress-note">
              {progress >= 100
                ? "Great job! You've met your daily target."
                : `${Math.round(dailyTarget - todayAmount)} L more to reach your goal.`}
            </p>
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Weekly Hydration</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
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
                <YAxis domain={[0, 3]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value) => [`${value} L`, 'Amount']}
                />
                <Bar
                  dataKey="amount"
                  fill="#00a896"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Hydration Log</h3>
        <div className="log-table-container">
          <table className="log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Target</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {hydrationData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.amount} L</td>
                  <td>{dailyTarget} L</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar-track">
                        <div
                          className={`progress-bar-fill ${
                            (item.amount / dailyTarget) * 100 >= 100
                              ? 'progress-high'
                              : (item.amount / dailyTarget) * 100 >= 75
                              ? 'progress-mid'
                              : 'progress-low'
                          }`}
                          style={{
                            width: `${Math.min((item.amount / dailyTarget) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="progress-percent">
                        {Math.round((item.amount / dailyTarget) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Hydration Tips</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <div className="tip-icon">
              <DropletIcon className="icon" />
            </div>
            <div className="tip-content">
              <h4>Morning Routine</h4>
              <p>
                Start your day with a glass of water to rehydrate after sleep
                and kickstart your metabolism.
              </p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">
              <DropletIcon className="icon" />
            </div>
            <div className="tip-content">
              <h4>Carry a Water Bottle</h4>
              <p>
                Keep a reusable water bottle with you throughout the day as a
                reminder to stay hydrated.
              </p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">
              <DropletIcon className="icon" />
            </div>
            <div className="tip-content">
              <h4>Set Reminders</h4>
              <p>
                Use your phone to set hourly reminders to drink water,
                especially during busy workdays.
              </p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">
              <DropletIcon className="icon" />
            </div>
            <div className="tip-content">
              <h4>Hydrating Foods</h4>
              <p>
                Eat water-rich foods like cucumbers, watermelon, and oranges to
                supplement your water intake.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hydration
