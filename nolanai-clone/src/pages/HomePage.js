import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar.js';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    
    <motion.div
      className="homepage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
        
      <nav className="navbar">
        <div className="logo">NolanAI Clone</div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </div>
      </nav>
      <motion.div
        className="hero-section"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1>Welcome to NolanAI Clone</h1>
        <p>Create and manage your scripts with ease.</p>
        <Link to="/dashboard" className="cta-button">Go to Dashboard</Link>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;