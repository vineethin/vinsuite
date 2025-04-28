// ✅ Updated LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://vinsuite.onrender.com/api/auth/login', {
        email,
        password
      });

      const user = res.data;
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      if (user.role === 'tester') navigate('/qa');
      else if (user.role === 'developer') navigate('/dev');
      else if (user.role === 'manager') navigate('/manager');
      else if (user.role === 'ba') navigate('/ba');
      else if (user.role === 'dba') navigate('/dba');
      else navigate('/project');

    } catch (err) {
      console.error('Login failed:', err);

      if (err.response) {
        // Server responded with a status outside 2xx
        if (err.response.status === 401) {
          alert('❌ Incorrect email or password. Please try again.');
        } else {
          alert(`❌ Login failed: ${err.response.data.message || 'Server error'}`);
        }
      } else if (err.request) {
        // Request made but no response
        alert('❌ Unable to reach server. Please check your internet connection.');
      } else {
        // Something else happened
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
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
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
