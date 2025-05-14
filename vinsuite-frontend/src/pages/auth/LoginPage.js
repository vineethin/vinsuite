import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from "../../contexts/AppContext";
import API from '../../apiConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUserRole, setUserId, setUserDepartment } = useApp();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => {
        source.cancel('Server took too long to respond.');
      }, 15000);

      const res = await axios.post(`${API.AUTH}/login`, {
        email,
        password,
      }, { cancelToken: source.token });

      clearTimeout(timeout);

      const user = res.data || {};
      const role = user.role || 'admin';
      const id = user.id || 'admin';
      const dept = user.department || '';

      setUserRole(role);
      setUserId(id);
      setUserDepartment(dept);

      // ✅ Role-based redirection
      if (role === 'admin') {
        const path = dept ? `/admin/${dept.toLowerCase()}` : '/admin';
        navigate(path);
      } else {
        switch (role) {
          case 'developer': navigate('/dev'); break;
          case 'qa':
          case 'tester': navigate('/qa'); break;
          case 'manager': navigate('/manager'); break;
          case 'ba': navigate('/ba'); break;
          case 'dba': navigate('/dba'); break;
          case 'saleslead':
          case 'sales': navigate('/sales'); break;
          case 'support': navigate('/support'); break;
          case 'finance': navigate('/finance'); break;
          case 'writer': navigate('/writer/dashboard'); break;
          default: navigate('/project'); break;
        }
      }

    } catch (err) {
      console.error('Login failed:', err);
      if (axios.isCancel(err)) {
        alert('❌ Server is taking too long to respond. Please try again shortly.');
      } else if (err.response?.status === 401) {
        alert('❌ Incorrect email or password.');
      } else {
        alert(`❌ Login failed: ${err.response?.data?.message || 'Unexpected server error.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">🔐 Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded flex items-center justify-center`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Logging in...</span>
              </div>
            ) : "Login"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link
            to="/register"
            title="Go to Registration Page"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
