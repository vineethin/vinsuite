import React, { useState } from 'react';
import axios from 'axios';
import API from '../../apiConfig';

const ElementIdentifier = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleSubmit = async () => {
    setError('');
    setResults([]);

    if (!htmlInput.trim()) {
      setError('Please paste HTML.');
      return;
    }

    if (!screenshot || !(screenshot instanceof File)) {
      setError('Please upload a valid image.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const result = reader.result;
        if (!result || typeof result !== 'string') {
          throw new Error('Failed to read image data.');
        }

        const base64Image = result.split(',')[1];
        if (!base64Image) {
          throw new Error('Image encoding failed.');
        }

        setLoading(true);
        const res = await axios.post(`${API.OPENAI_XPATH}`, {
          html: htmlInput,
          imageBase64: base64Image,
        });

        const output = res.data.output?.content || res.data.output || 'No output';
        const lines = output.split('\n').filter(Boolean);
        const parsed = lines.map((line, i) => ({
          id: i,
          checked: true,
          xpath: line.trim()
        }));

        setResults(parsed);
      } catch (err) {
        setError('Error: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading image file.');
    };

    try {
      reader.readAsDataURL(screenshot);
    } catch (readError) {
      setError('Image could not be processed. Please try another file.');
    }
  };

  const toggleCheck = (id) => {
    setResults(prev =>
      prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r)
    );
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">XPath Generator from Screenshot</h2>

      <textarea
        className="w-full border p-2 mb-4"
        rows={8}
        placeholder="Paste your HTML here..."
        value={htmlInput}
        onChange={(e) => setHtmlInput(e.target.value)}
      />

      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
      {imagePreview && (
        <div className="mb-4">
          <img src={imagePreview} alt="Preview" className="w-64 border rounded shadow" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate XPath'}
      </button>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Results:</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Select</th>
                <th className="border px-2 py-1">XPath</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ id, xpath, checked }) => (
                <tr key={id}>
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck(id)}
                    />
                  </td>
                  <td className="border px-2 py-1 font-mono break-all">{xpath}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ElementIdentifier;
