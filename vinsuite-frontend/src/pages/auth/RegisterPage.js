import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../apiConfig';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('tester');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API.AUTH}/register`, {
        email,
        password,
        name,
        role
      });

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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="tester">Tester</option>
            <option value="developer">Developer</option>
            <option value="manager">Manager</option>
            <option value="ba">Business Analyst</option>
            <option value="dba">DBA</option>
          </select>
          <button
            type="submit"
            disabled={loading}
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
              "Register"
            )}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
