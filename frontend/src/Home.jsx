import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">BioLume</Link>
        </div>
        <div className="navbar-links">
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
      <header className="hero-section">
        <div className="hero-content">
          <h1>Track Your Health, Illuminate Your Life</h1>
          <p>BioLume helps you monitor your sleep, water intake, and lifestyle habits to achieve a healthier you.</p>
          <Link to="/signup" className="cta-button">Get Started</Link>
        </div>
      </header>
      <main className="features-section">
        <div className="feature">
          <h2>Track Sleep</h2>
          <p>Monitor your sleep patterns to improve your rest and recovery.</p>
        </div>
        <div className="feature">
          <h2>Hydration Goals</h2>
          <p>Stay on top of your water intake to keep your body hydrated and energized.</p>
        </div>
        <div className="feature">
          <h2>Lifestyle Insights</h2>
          <p>Gain insights into your daily habits and make informed decisions for a better lifestyle.</p>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025 BioLume. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
