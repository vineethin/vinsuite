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
        password
      }, { cancelToken: source.token });
  
      clearTimeout(timeout);
  
      const user = res.data;
  
      // Assuming admin login returns a user with role 'admin'
      if (user.role === 'admin') {
        localStorage.setItem("userRole", 'admin');
        localStorage.setItem("userName", 'Admin User');
        localStorage.setItem("userId", 'admin'); // Using a dummy admin user ID
      } else {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.role);
      }
  
      navigate('/project'); // Redirecting to the project page after login
  
    } catch (err) {
      console.error('Login failed:', err);
  
      if (axios.isCancel(err)) {
        alert('❌ Server is taking too long to respond. Please try again in a moment.');
      } else if (err.response) {
        if (err.response.status === 401) {
          alert('❌ Incorrect email or password. Please try again.');
        } else {
          alert(`❌ Login failed: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        alert('❌ Unable to reach server. Please check your internet connection.');
      } else {
        alert('❌ An unexpected error occurred. Please try again.');
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
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            🚀 Server may take a few seconds to wake up if idle.
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
