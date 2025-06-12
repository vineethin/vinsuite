import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Activating...");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid activation link.");
      setIsSuccess(false);
      return;
    }

    fetch(`/api/auth/activate?token=${token}`)
      .then((res) => res.text())
      .then((msg) => {
        setMessage(msg);
        if (msg.toLowerCase().includes("successfully")) {
          setIsSuccess(true);

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setIsSuccess(false);
        }
      })
      .catch(() => {
        setMessage("Something went wrong. Please try again.");
        setIsSuccess(false);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className={`text-xl font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {message}
        </h1>
        {isSuccess && (
          <p className="mt-4 text-sm text-gray-600">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
