import React, { useState, useEffect } from 'react';
import API from '../../apiConfig';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import jsPDF from 'jspdf';
import ToolLayout from '../../components/common/ToolLayout';

const DocumentAssistant = () => {
  const [docType, setDocType] = useState('Report');
  const [purpose, setPurpose] = useState('');
  const [points, setPoints] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState(null);

  const docTypes = ['Report', 'Proposal', 'Meeting Notes', 'Whitepaper', 'Summary'];

  useEffect(() => {
    const fetchQuota = async () => {
      const userId = localStorage.getItem('userId') || 'anonymous';
      try {
        const res = await fetch(`${API.WRITER}/quota`, {
          headers: { 'X-USER-ID': userId }
        });
        const text = await res.text();
        setQuota(text);
      } catch (err) {
        console.error("Quota fetch failed:", err);
      }
    };
    fetchQuota();
  }, []);

  const handleGenerate = async () => {
    if (!purpose || !points) {
      alert('Please enter the purpose and main points.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API.WRITER}/generate-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType, purpose, points }),
      });

      const data = await response.text();
      setResult(data);

      const userId = localStorage.getItem('userId') || 'anonymous';
      const res = await fetch(`${API.WRITER}/quota`, {
        headers: { 'X-USER-ID': userId }
      });
      const updatedQuota = await res.text();
      setQuota(updatedQuota);

    } catch (error) {
      console.error(error);
      setResult('⚠️ Failed to generate document.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsDocx = () => {
    const html = `<html><body>${result.replace(/\n/g, "<br>")}</body></html>`;
    const blob = htmlDocx.asBlob(html);
    saveAs(blob, "Document_Assistant.docx");
  };

  const downloadAsPdf = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result, 180);
    doc.text(lines, 10, 10);
    doc.save("Document_Assistant.pdf");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("✅ Copied to clipboard!");
    } catch {
      alert("❌ Failed to copy.");
    }
  };

  return (
    <ToolLayout title="📝 AI Document Assistant" backTo="/admin/writer" showLogout={true}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {quota !== null && (
          <div className="text-sm text-gray-600">
            🧮 Remaining quota: {quota}/20
          </div>
        )}

        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full p-3 border rounded-md"
        >
          {docTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Purpose of the document (e.g., summarize Q1 performance)"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full p-3 border rounded-md"
        />

        <textarea
          rows="4"
          placeholder="Main points to include (comma or line separated)"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full p-3 border rounded-md"
        ></textarea>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Document'}
        </button>

        {result && (
          <div className="mt-6">
            <div className="p-4 border bg-gray-50 rounded whitespace-pre-wrap">
              {result}
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <button
                onClick={downloadAsDocx}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-md"
              >
                📄 Export Word
              </button>
              <button
                onClick={downloadAsPdf}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md"
              >
                🧾 Export PDF
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow-md"
              >
                📋 Copy Text
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default DocumentAssistant;
