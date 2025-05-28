import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../apiConfig';

const CompanyAdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, projects: 0 });
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const tenantId = localStorage.getItem('tenantId');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, []);

  const fetchStats = () => {
    fetch(`${API.BASE_URL}/api/company/stats?tenantId=${tenantId}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("❌ Failed to load stats", err));
  };

  const fetchProjects = () => {
    fetch(`${API.BASE_URL}/api/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("❌ Failed to load projects", err));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectForm.name.trim()) {
      setMessage("❌ Project name is required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API.BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          project: {
            name: projectForm.name,
            description: projectForm.description,
            tenantId: tenantId
          }
        })
      });

      if (!res.ok) throw new Error("Project creation failed");

      setMessage("✅ Project created successfully");
      setMessageType("success");
      setProjectForm({ name: '', description: '' });
      fetchStats();
      fetchProjects();
    } catch (err) {
      console.error("❌", err);
      setMessage("❌ Failed to create project");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="🏢 Company Admin Dashboard">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-white rounded shadow p-4 border">
          <h2 className="text-lg font-semibold">👥 Users</h2>
          <p className="text-3xl font-bold text-blue-700">{stats.users}</p>
        </div>
        <div className="bg-white rounded shadow p-4 border">
          <h2 className="text-lg font-semibold">📁 Projects</h2>
          <p className="text-3xl font-bold text-green-700">{stats.projects}</p>
        </div>
      </div>

      {/* Create Project Form */}
      <form
        onSubmit={handleCreateProject}
        className="bg-gray-50 p-6 rounded shadow mt-6 max-w-xl mx-auto border"
      >
        <h3 className="text-xl font-semibold mb-4">➕ Create New Project</h3>

        <input
          type="text"
          placeholder="Project Name"
          value={projectForm.name}
          onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={projectForm.description}
          onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          rows={3}
        ></textarea>

        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>

        {message && (
          <p className={`mt-2 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>

      {/* Recent Projects Table */}
      <div className="mt-10 p-4">
        <h3 className="text-lg font-semibold mb-4">🕒 Recent Projects</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">#</th>
                <th className="px-4 py-2 border text-left">Name</th>
                <th className="px-4 py-2 border text-left">Description</th>
                <th className="px-4 py-2 border text-left">Created By</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((proj, index) => (
                  <tr key={proj.id || index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{proj.name}</td>
                    <td className="border px-4 py-2">{proj.description || '-'}</td>
                    <td className="border px-4 py-2">{proj.createdBy?.name || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border px-4 py-4 text-center text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyAdminDashboard;
