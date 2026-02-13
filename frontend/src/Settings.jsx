import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      dailyReminders: true,
      weeklyReports: true,
      achievementAlerts: true,
      sleepReminders: false,
      hydrationReminders: true,
    },
    targets: {
      sleep: 8,
      hydration: 2.5,
      sunlight: 30,
      screenTime: 2,
    },
    profile: {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      age: 32,
      weight: 70,
      height: 175,
      gender: 'male',
    },
    privacy: {
      shareData: false,
      anonymousAnalytics: true,
    },
  });

  const handleNotificationChange = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handleTargetChange = (key, value) => {
    setSettings({
      ...settings,
      targets: {
        ...settings.targets,
        [key]: value,
      },
    });
  };

  const handleProfileChange = (key, value) => {
    setSettings({
      ...settings,
      profile: {
        ...settings.profile,
        [key]: value,
      },
    });
  };

  const handlePrivacyChange = (key) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key],
      },
    });
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <div className="settings-card">
        <div className="settings-nav">
          <button className="nav-btn active">All Settings</button>
        </div>

        {/* Profile Section */}
        <div className="settings-section">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h3>Profile Information</h3>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Age</label>
              <input
                type="number"
                value={settings.profile.age}
                onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select
                value={settings.profile.gender}
                onChange={(e) => handleProfileChange('gender', e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="form-field">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={settings.profile.weight}
                onChange={(e) => handleProfileChange('weight', parseInt(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Height (cm)</label>
              <input
                type="number"
                value={settings.profile.height}
                onChange={(e) => handleProfileChange('height', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Target Settings */}
        <div className="settings-section">
          <div className="section-header">
            <span className="section-icon">🎯</span>
            <h3>Daily Targets</h3>
          </div>
          <div className="slider-group">
            <div className="slider-item">
              <label>Sleep Duration: {settings.targets.sleep} hours</label>
              <input
                type="range"
                min="5"
                max="12"
                step="0.5"
                value={settings.targets.sleep}
                onChange={(e) => handleTargetChange('sleep', parseFloat(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-item">
              <label>Hydration: {settings.targets.hydration} liters</label>
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={settings.targets.hydration}
                onChange={(e) => handleTargetChange('hydration', parseFloat(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-item">
              <label>Sunlight Exposure: {settings.targets.sunlight} minutes</label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={settings.targets.sunlight}
                onChange={(e) => handleTargetChange('sunlight', parseInt(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-item">
              <label>Max Screen Time: {settings.targets.screenTime} hours</label>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={settings.targets.screenTime}
                onChange={(e) => handleTargetChange('screenTime', parseFloat(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <div className="section-header">
            <span className="section-icon">🔔</span>
            <h3>Notifications</h3>
          </div>
          <div className="notification-list">
            <div className="notification-item">
              <div>
                <h4>Daily Reminders</h4>
                <p>Get daily reminders to log your health data</p>
              </div>
              <div className="toggle-switch" onClick={() => handleNotificationChange('dailyReminders')}>
                <div className={`toggle-slide ${settings.notifications.dailyReminders ? 'active' : ''}`}></div>
              </div>
            </div>
            <div className="notification-item">
              <div>
                <h4>Weekly Reports</h4>
                <p>Receive a weekly summary of your health metrics</p>
              </div>
              <div className="toggle-switch" onClick={() => handleNotificationChange('weeklyReports')}>
                <div className={`toggle-slide ${settings.notifications.weeklyReports ? 'active' : ''}`}></div>
              </div>
            </div>
            <div className="notification-item">
              <div>
                <h4>Achievement Alerts</h4>
                <p>Get notified when you reach a health milestone</p>
              </div>
              <div className="toggle-switch" onClick={() => handleNotificationChange('achievementAlerts')}>
                <div className={`toggle-slide ${settings.notifications.achievementAlerts ? 'active' : ''}`}></div>
              </div>
            </div>
            <div className="notification-item">
              <div>
                <h4>Sleep Reminders</h4>
                <p>Remind you when it's time to prepare for sleep</p>
              </div>
              <div className="toggle-switch" onClick={() => handleNotificationChange('sleepReminders')}>
                <div className={`toggle-slide ${settings.notifications.sleepReminders ? 'active' : ''}`}></div>
              </div>
            </div>
            <div className="notification-item">
              <div>
                <h4>Hydration Reminders</h4>
                <p>Regular reminders to drink water throughout the day</p>
              </div>
              <div className="toggle-switch" onClick={() => handleNotificationChange('hydrationReminders')}>
                <div className={`toggle-slide ${settings.notifications.hydrationReminders ? 'active' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <div className="section-header">
            <span className="section-icon">🔒</span>
            <h3>Privacy</h3>
          </div>
          <div className="notification-list">
            <div className="notification-item">
              <div>
                <h4>Share Data with Healthcare Providers</h4>
                <p>Allow your healthcare providers to access your health data</p>
              </div>
              <div className="toggle-switch" onClick={() => handlePrivacyChange('shareData')}>
                <div className={`toggle-slide ${settings.privacy.shareData ? 'active' : ''}`}></div>
              </div>
            </div>
            <div className="notification-item">
              <div>
                <h4>Anonymous Analytics</h4>
                <p>Help improve the app by sharing anonymous usage data</p>
              </div>
              <div className="toggle-switch" onClick={() => handlePrivacyChange('anonymousAnalytics')}>
                <div className={`toggle-slide ${settings.privacy.anonymousAnalytics ? 'active' : ''}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="save-btn">Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;
