import React, { useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const userId = 1; // TODO: Replace with real auth-integrated userId

    try {
      const response = await fetch(`https://vinsuite.onrender.com/api/projects?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        toast.success('✅ Project created successfully!');
        setName('');
        setDescription('');
      } else {
        const errorText = await response.text();
        toast.error(`❌ Failed: ${errorText || 'Error creating project'}`);
      }
    } catch (error) {
      toast.error(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Create New Project
        </h1>

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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 px-4 rounded transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>

      {/* ✅ Global Toast Display */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
