import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const [message, setMessage] = useState(''); // New state for feedback message

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = 1; // For example, user ID 1

    const projectData = {
      name: name,
      description: description,
    };

    setLoading(true); // Start loading

    try {
      const response = await fetch(`https://vinsuite.onrender.com/api/projects?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Project created successfully!'); // Success message
        setName(''); // Clear form fields
        setDescription('');
      } else {
        setMessage('Error creating project'); // Error message
      }
    } catch (error) {
      setMessage('Error: ' + error.message); // Error handling
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="App">
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Project Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Project Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Submit'}
        </button>
      </form>

      {message && <p>{message}</p>} {/* Show message */}
    </div>
  );
}

export default App;