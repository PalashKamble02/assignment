import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/CreateScript.css';

const CreateScript = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsGenerating(true);
      const response = await api.post('/generate-script', {
        title,
        description,
        userId: user.id,
      });
      setScriptContent(response.data);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.post('/scripts', {
        title,
        description,
        content: scriptContent,
        userId: user.id,
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save script');
    }
  };

  return (
    <motion.div
      className="create-script"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="create-script-box"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1>Create a New Script</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Script'}
          </button>
        </form>

        {scriptContent && (
          <motion.div
            className="generated-script"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Generated Script</h2>
            <pre>{scriptContent}</pre>
            <button onClick={handleSave} className="save-button">
              Save Script
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CreateScript;