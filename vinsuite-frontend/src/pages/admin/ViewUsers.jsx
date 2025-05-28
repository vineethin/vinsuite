import React, { useEffect, useState } from 'react';
import API from '../../apiConfig';
import DashboardLayout from '../../components/DashboardLayout';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');

    if (!tenantId) {
      setError('No tenant ID found. Please log in again.');
      setLoading(false);
      return;
    }

    fetch(`${API.VIEW_USERS}/by-tenant?tenantId=${tenantId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error loading users", err);
        setError('Failed to load user data.');
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout title="👥 Registered Users">
      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr key={user.id || i} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{i + 1}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border px-4 py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ViewUsers;
