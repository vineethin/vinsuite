// src/pages/auth/VerifyEmail.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/resend-activation?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      const message = await res.text();
      if (res.ok) {
        toast.success(message || "A new activation link was sent to your email.");
      } else {
        toast.error(message || "Failed to resend activation link.");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">Verify Your Email</h1>
        <p className="mb-4">Didn't get the activation email? Resend it below.</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleResend}
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Sending...' : 'Resend Activation Link'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
