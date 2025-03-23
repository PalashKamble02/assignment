import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate , Link} from 'react-router-dom';
import api from '../../utils/api';
import '../../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post('/login', { email, password });
      console.log('Login successful:', response.data);
  
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
  
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="login-box"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;