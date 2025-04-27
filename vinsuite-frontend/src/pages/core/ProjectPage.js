import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(localStorage.getItem("activeProjectId") || "");
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("https://vinsuite.onrender.com/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const res = await fetch("https://vinsuite.onrender.com/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: parseInt(userId),
        project: { name: newName, description: newDescription }
      })
    });

    if (res.ok) {
      const created = await res.json();
      setSelectedId(String(created.id));
      localStorage.setItem("activeProjectId", String(created.id));
      setProjects([...projects, created]);
      setMessage("✅ Project created and selected.");
      setNewName('');
      setNewDescription('');
    } else {
      setMessage("❌ Failed to create project.");
    }
  };

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    localStorage.setItem("activeProjectId", String(id));
    setMessage("✅ Project selected.");
  };

  const handleContinue = () => {
    if (!selectedId) {
      alert("Please select or create a project first.");
      return;
    }

    const role = localStorage.getItem("userRole");

    let dashboardRoute = "/qa"; // default
    if (role === "developer") dashboardRoute = "/dev";
    else if (role === "manager") dashboardRoute = "/manager";
    else if (role === "ba") dashboardRoute = "/ba";
    else if (role === "dba") dashboardRoute = "/dba";

    navigate(dashboardRoute);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Project Dashboard</h2>
          <LogoutButton />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Select existing project:</label>
          <select
            className="w-full border rounded px-3 py-2 shadow-sm"
            value={selectedId}
            onChange={handleSelect}
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <hr className="my-6" />

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Create New Project</h3>
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Project Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <textarea
              placeholder="Project Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded shadow-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow"
          >
            Create Project
          </button>
        </form>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className={`px-6 py-2 rounded text-white font-semibold ${
              !selectedId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Continue to Dashboard →
          </button>
        </div>

        {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}
      </div>
    </div>
  );
}

export default ProjectPage;
