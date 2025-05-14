import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const userId = 1; // Replace with actual user ID from auth in production

    try {
      const response = await fetch(`https://vinsuite.onrender.com/api/projects?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        setMessage('✅ Project created successfully!');
        setName('');
        setDescription('');
      } else {
        setMessage('❌ Error creating project');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Create New Project</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:outline-blue-400"
              aria-label="Project Name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
              Project Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full border px-3 py-2 rounded focus:outline-blue-400"
              aria-label="Project Description"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 px-4 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>

        {message && (
          <p className="text-sm mt-4 text-center text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}

export default App;
