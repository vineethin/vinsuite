import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../apiConfig';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import jsPDF from 'jspdf';

const ContentGenerator = () => {
    const navigate = useNavigate();
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Informative');
    const [audience, setAudience] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [quota, setQuota] = useState(null);

    const tones = ['Informative', 'Persuasive', 'Casual', 'Professional', 'Witty'];

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
        if (!topic || !audience) {
            alert('Please enter both topic and audience.');
            return;
        }

        setLoading(true);

        try {
            const userId = localStorage.getItem('userId') || 'anonymous';

            const response = await fetch(`${API.WRITER}/generate-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-USER-ID': userId
                },
                body: JSON.stringify({ topic, tone, audience }),
            });

            const data = await response.text();
            setResult(data);

            const res = await fetch(`${API.WRITER}/quota`, {
                headers: { 'X-USER-ID': userId }
            });
            const updatedQuota = await res.text();
            setQuota(updatedQuota);

        } catch (error) {
            console.error('Error:', error);
            setResult('⚠️ Error generating content.');
        } finally {
            setLoading(false);
        }
    };

    const downloadAsDocx = () => {
        const html = `<html><body>${result.replace(/\n/g, "<br>")}</body></html>`;
        const blob = htmlDocx.asBlob(html);
        saveAs(blob, "Content_Writer.docx");
    };

    const downloadAsPdf = () => {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(result, 180);
        doc.text(lines, 10, 10);
        doc.save("Content_Writer.pdf");
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            alert("✅ Copied to clipboard!");
        } catch (err) {
            alert("❌ Failed to copy.");
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-700">✍️ AI Content Generator</h1>
                <button onClick={() => navigate('/')} className="text-sm text-blue-500 underline">Back to Dashboard</button>
            </div>

            <div className="space-y-4">
                {quota !== null && (
                    <div className="text-sm text-gray-600">
                        🧮 Remaining quota: {quota}/20
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Enter topic (e.g., Benefits of Remote Work)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 border rounded-md"
                />

                <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-3 border rounded-md"
                >
                    {tones.map((t) => (
                        <option key={t}>{t}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Enter target audience (e.g., Startup Founders)"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full p-3 border rounded-md"
                />

                <button
                    onClick={handleGenerate}
                    className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Content'}
                </button>

                {result && (
                    <div className="mt-6">
                        <div className="p-4 border bg-gray-50 rounded whitespace-pre-wrap">
                            {result}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3">
                            <button
                                onClick={downloadAsDocx}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-md transition duration-200"
                            >
                                📄 Export Word
                            </button>
                            <button
                                onClick={downloadAsPdf}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md transition duration-200"
                            >
                                🧾 Export PDF
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow-md transition duration-200"
                            >
                                📋 Copy Text
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentGenerator;
