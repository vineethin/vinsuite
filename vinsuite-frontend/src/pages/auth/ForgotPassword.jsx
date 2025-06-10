// src/pages/auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });
      const message = await res.text();
      if (res.ok) {
        toast.success(message || 'Reset link sent to your inbox.');
      } else {
        toast.error(message || 'Something went wrong.');
      }
    } catch {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">🔐 Forgot Password</h2>
        <p className="mb-4 text-sm text-gray-600">Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
