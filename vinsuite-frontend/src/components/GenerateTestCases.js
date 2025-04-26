import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function GenerateTestCases() {
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const projectId = localStorage.getItem("activeProjectId");

  const handleGenerate = async () => {
    if (!projectId) {
      alert("Project not selected. Please go to /projects");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8081/api/ai/generate-testcases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement, projectId })
      });

      const data = await res.json();
      localStorage.setItem("generatedTestCases", JSON.stringify(data));
      navigate("/results");
    } catch (err) {
      setMessage('Error generating test cases: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <LogoutButton />
      <h2>AI Test Case Generator</h2>
      <textarea
        rows="5"
        cols="60"
        placeholder="Enter requirement like: As a user, I should be able to login..."
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
      />
      <br /><br />
      <button onClick={handleGenerate} disabled={loading || !requirement}>
        {loading ? 'Generating...' : 'Generate Test Cases'}
      </button>
      <br />
      {message && <p>{message}</p>}
    </div>
  );
}

export default GenerateTestCases;
