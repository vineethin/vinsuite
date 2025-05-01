import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../apiConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const user = res.data;

      localStorage.setItem("userId", user.id || 'admin');
      localStorage.setItem("userName", user.name || 'User');
      localStorage.setItem("userRole", user.role);

      // 🔁 Role-based redirect
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'developer':
          navigate('/dev');
          break;
        case 'qa':
          navigate('/qa');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'ba':
          navigate('/ba');
          break;
        case 'dba':
          navigate('/dba');
          break;
        case 'saleslead':
          navigate('/sales');
          break;
        case 'support':
          navigate('/support');
          break;
        default:
          navigate('/project');
      }


    } catch (err) {
      console.error('Login failed:', err);

      if (axios.isCancel(err)) {
        alert('❌ Server is taking too long to respond. Please try again shortly.');
      } else if (err.response) {
        if (err.response.status === 401) {
          alert('❌ Incorrect email or password.');
        } else {
          alert(`❌ Login failed: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        alert('❌ Could not reach the server. Please check your internet connection.');
      } else {
        alert('❌ Unexpected error occurred during login.');
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
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
            ) : (
              "Login"
            )}
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            🚀 Server may take a few seconds to respond if idle.
          </p>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
