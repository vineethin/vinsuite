import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API from '../../apiConfig';
import { toast } from 'react-toastify'; // ✅ toast import

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
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
        role,
        department,
      });

      if (res.status === 200) {
        toast.success("✅ Registration successful. Please check your email to activate your account.");
        navigate('/verify-email');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        const msg = err.response?.data?.toString();

        if (msg?.includes("not activated")) {
          toast.warning("⚠️ Account not activated. We've resent your activation link.", {
            position: "bottom-center",
            theme: "light",
            autoClose: 6000,
          });
          navigate('/verify-email');
        } else {
          toast.error("❌ Email already registered.", {
            position: "top-right",
            theme: "dark",
            autoClose: 5000,
          });
        }

      } else if (err.response?.data?.message) {
        toast.error(`❌ ${err.response.data.message}`, {
          position: "top-right",
          theme: "colored",
        });
      } else {
        toast.error("❌ Registration failed. Please try again.", {
          position: "top-right",
          theme: "colored",
        });
      }

      console.error('Registration error:', err);
    }
    finally {
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
            onChange={(e) => {
              setDepartment(e.target.value);
              setRole('');
            }}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
            <option value="Trading">Trading</option>
            <option value="Writer">Writer</option>
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

            {department === 'IT' && (
              <>
                <option value="tester">Tester</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="ba">Business Analyst</option>
                <option value="dba">DBA</option>
              </>
            )}

            {department === 'Finance' && (
              <>
                <option value="finance">Finance Analyst</option>
                <option value="auditor">Auditor</option>
              </>
            )}

            {department === 'HR' && (
              <>
                <option value="recruiter">Recruiter</option>
                <option value="hrmanager">HR Manager</option>
              </>
            )}

            {department === 'Sales' && (
              <>
                <option value="saleslead">Sales Lead</option>
                <option value="salesrep">Sales Representative</option>
              </>
            )}

            {department === 'Support' && (
              <option value="support">Support Engineer</option>
            )}

            {department === 'Trading' && (
              <>
                <option value="trader">Trader</option>
                <option value="portfolioanalyst">Portfolio Analyst</option>
                <option value="riskmanager">Risk Manager</option>
              </>
            )}

            {department === 'Writer' && (
              <option value="writer">Writer</option>
            )}
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white py-2 rounded flex justify-center items-center`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
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
