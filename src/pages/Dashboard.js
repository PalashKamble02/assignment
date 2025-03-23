import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import './../styles/Dashboard.css';

const Dashboard = () => {
  const [scripts, setScripts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await api.get(`/scripts/${user.id}`);
        setScripts(response.data);
      } catch (error) {
        console.error('Error fetching scripts:', error);
      }
    };

    if (user) {
      fetchScripts();
    }
  }, [user]);

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Dashboard</h1>
      <Link to="/create-script" className="create-script-button">
        Create Script
      </Link>
      <h2>Your Scripts</h2>
      {scripts.length > 0 ? (
        <motion.div
          className="script-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {scripts.map((script) => (
            <motion.div
              key={script._id}
              className="script-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>{script.title}</h3>
              <p>{script.description}</p>
              <pre>{script.content}</pre>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p>No scripts found. Create a new script to get started!</p>
      )}
    </motion.div>
  );
};

export default Dashboard;