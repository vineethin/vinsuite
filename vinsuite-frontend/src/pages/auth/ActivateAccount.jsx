// src/pages/auth/ActivateAccount.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Activating...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid activation link.");
      return;
    }

    fetch(`/api/auth/activate?token=${token}`)
      .then((res) => res.text())
      .then((msg) => setMessage(msg))
      .catch(() => setMessage("Something went wrong. Please try again."));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-xl font-bold">{message}</h1>
      </div>
    </div>
  );
};

export default ActivateAccount;
