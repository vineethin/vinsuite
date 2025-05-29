import React, { useEffect, useState } from 'react';

const allowedExtensions = ['.js', '.ts', '.py', '.java', '.cs', '.go', '.php', '.rb', '.kt', '.swift'];

const hasAllowedExtension = (filename) =>
  allowedExtensions.some((ext) => filename.toLowerCase().endsWith(ext));

const GitRepoPanel = ({ repoPath, setCode, setSelectedFile }) => {
  const [allFiles, setAllFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFile, setLocalSelectedFile] = useState('');
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  useEffect(() => {
    if (!repoPath) return;

    setLoadingFiles(true);
    fetch('/api/dev/git/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: repoPath }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllFiles(data);
          setFiles(data.filter((f) => hasAllowedExtension(f.name)));
        } else {
          setError(data.error || 'Failed to load file list.');
        }
      })
      .catch(() => setError('Failed to connect to file list API.'))
      .finally(() => setLoadingFiles(false));
  }, [repoPath]);

  useEffect(() => {
    if (showAllTypes) {
      setFiles(allFiles);
    } else {
      setFiles(allFiles.filter((f) => hasAllowedExtension(f.name)));
    }
  }, [showAllTypes, allFiles]);

  const loadFileContent = (relativePath) => {
    const fullPath = `${repoPath}/${relativePath}`;
    setLocalSelectedFile(relativePath);
    setSelectedFile(relativePath);

    fetch('/api/dev/git/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: fullPath }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setCode(data.content);
        } else {
          setCode(`// Error: ${data.error || 'Could not read file.'}`);
        }
      })
      .catch(() => setCode('// Error: Unable to read file.'));
  };

  if (!repoPath) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">📁 Files in Repository</h3>
        <label className="text-sm flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={showAllTypes}
            onChange={() => setShowAllTypes(!showAllTypes)}
          />
          Show all file types
        </label>
      </div>

      {loadingFiles ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading files...
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : files.length === 0 ? (
        <p>No files found in repo.</p>
      ) : (
        <>
          <ul className="border rounded p-2 bg-white text-sm max-h-60 overflow-auto">
            {(showAll ? files : files.slice(0, 10)).map((f) => (
              <li key={f.path}>
                <button
                  onClick={() => loadFileContent(f.path)}
                  className={`w-full text-left px-2 py-1 rounded hover:bg-blue-50 ${
                    selectedFile === f.path ? 'bg-blue-100 font-semibold' : ''
                  }`}
                >
                  {f.path}
                </button>
              </li>
            ))}
          </ul>

          {files.length > 10 && (
            <div className="mt-2 text-right">
              <button
                className="text-blue-600 text-sm hover:underline"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show less ▲' : `Show ${files.length - 10} more ▼`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GitRepoPanel;
