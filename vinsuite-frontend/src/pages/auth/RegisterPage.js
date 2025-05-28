import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API from '../../apiConfig';

const departmentRolesMap = {
  IT: ['tester', 'developer', 'manager', 'ba', 'dba'],
  Finance: ['finance', 'auditor'],
  HR: ['recruiter', 'hrmanager'],
  Sales: ['saleslead', 'salesrep'],
  Support: ['support'],
  Trading: ['trader', 'portfolioanalyst', 'riskmanager'],
  Writer: ['writer'],
  // 🚫 Do NOT include companyadmin here to hide from UI
};

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setDepartment(selectedDept);
    const roles = departmentRolesMap[selectedDept] || [];
    setRole(roles.length === 1 ? roles[0] : '');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { email, password, name, role, department };

      if (payload.role === 'companyadmin') {
        alert("❌ You cannot register as Company Admin.");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API.AUTH}/register`, payload);

      if (res.status === 200) {
        alert('✅ Registered Successfully');
        navigate('/login');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        alert('❌ Email already registered.');
      } else if (err.response?.data?.message) {
        alert(`❌ ${err.response.data.message}`);
      } else {
        alert('❌ Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">📝 Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />

          {/* Department Dropdown */}
          <select
            value={department}
            onChange={handleDepartmentChange}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Select Department</option>
            {Object.keys(departmentRolesMap).map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Role Dropdown */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
            disabled={!department}
          >
            <option value="">Select Role</option>
            {(departmentRolesMap[department] || []).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading || !role}
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded flex justify-center items-center`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Registering...</span>
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
