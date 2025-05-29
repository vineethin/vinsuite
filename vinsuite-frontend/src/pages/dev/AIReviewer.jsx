import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../apiConfig';
import GitRepoPanel from '../../components/dev/GitRepoPanel';

const highlightReview = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    let className = '';
    if (/\b(error|issue|problem|bug|bad practice)\b/i.test(line)) {
      className = 'text-red-600 font-semibold';
    } else if (/\b(optimize|improve|refactor|suggestion)\b/i.test(line)) {
      className = 'text-yellow-600';
    } else if (/\b(good|clean|well done|great)\b/i.test(line)) {
      className = 'text-green-600';
    }
    return (
      <div key={i} className={className}>
        {line}
      </div>
    );
  });
};

const AIReviewer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('paste');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [gitStatus, setGitStatus] = useState('');
  const [repoPath, setRepoPath] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  useEffect(() => {
    if (selectedFile && code.trim()) {
      handleReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, code]);

  const handleReview = async () => {
    if (!code.trim()) {
      alert("Please provide code to review.");
      return;
    }

    setLoading(true);
    setReview('');
    try {
      const response = await fetch(API.AI_REVIEWER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.text();
      setReview(response.ok ? result : `// Error from reviewer: ${result}`);
    } catch (err) {
      setReview('// Error: Unable to connect to reviewer service.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitClone = async () => {
    setGitStatus('🔄 Cloning repository...');
    setRepoPath('');
    setSelectedFile('');
    try {
      const response = await fetch('/api/dev/git/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, branch }),
      });

      const result = await response.json();
      if (response.ok && result.message) {
        const match = result.message.match(/to:\s(.+)$/);
        const path = match ? match[1].trim() : '';
        setGitStatus(`✅ Cloned to: ${path}`);
        setRepoPath(path);
      } else {
        setGitStatus(`❌ ${result.error || 'Clone failed'}`);
      }
    } catch (err) {
      setGitStatus('❌ Failed to connect to Git service.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setCode(reader.result);
    reader.readAsText(file);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🧠 AI Code Reviewer
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dev")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
          >
            ⬅️ Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Language:</label>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setCode('');
          }}
          className="border p-2 rounded w-full"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="kotlin">Kotlin</option>
          <option value="swift">Swift</option>
        </select>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'paste' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => {
            setActiveTab('paste');
            setSelectedFile('');
          }}
        >
          Paste Code
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => {
            setActiveTab('upload');
            setSelectedFile('');
          }}
        >
          Upload File
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'git' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => {
            setActiveTab('git');
            setSelectedFile('');
          }}
        >
          Connect Git Repository
        </button>
      </div>

      {activeTab === 'paste' && (
        <>
          <label className="block mb-1 font-medium">Paste Your Code:</label>
          <textarea
            rows="10"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border p-2 mb-4 rounded font-mono"
            placeholder="Paste your function/class/code snippet here"
          />
        </>
      )}

      {activeTab === 'upload' && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload File:</label>
          <input
            type="file"
            accept=".js,.ts,.py,.java,.cs,.go,.php,.rb,.kt,.swift,.txt"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {activeTab === 'git' && (
        <div className="p-4 border rounded mb-4">
          <h2 className="font-semibold mb-2">🔗 Connect Git Repository</h2>
          <input
            className="border px-2 py-1 w-full mb-2"
            type="text"
            placeholder="https://github.com/your/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <input
            className="border px-2 py-1 w-full mb-2"
            type="text"
            placeholder="Branch name (default: main)"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleGitClone}
          >
            Clone & Analyze
          </button>
          <p className="text-sm mt-2">{gitStatus}</p>
          <GitRepoPanel
            repoPath={repoPath}
            setCode={setCode}
            setSelectedFile={setSelectedFile}
          />
        </div>
      )}

      {selectedFile && (
        <div className="mb-2 text-sm text-gray-600">
          <strong>Selected File:</strong> {selectedFile}
        </div>
      )}

      <button
        onClick={handleReview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Reviewing...' : 'Review Code'}
      </button>

      {review && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Review Result:</h2>
          <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto border text-sm font-mono">
            {highlightReview(review)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReviewer;