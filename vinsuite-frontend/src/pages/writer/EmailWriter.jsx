import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../apiConfig';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import jsPDF from 'jspdf';

const EmailWriter = () => {
    const navigate = useNavigate();
    const [emailType, setEmailType] = useState('Cold Outreach');
    const [productOrService, setProductOrService] = useState('');
    const [recipient, setRecipient] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const emailTypes = [
        'Cold Outreach',
        'Product Promotion',
        'Newsletter',
        'Follow-up',
        'Thank You'
    ];

    const handleGenerate = async () => {
        if (!productOrService || !recipient) {
            alert('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API.WRITER}/generate-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailType, productOrService, recipient })
            });

            const data = await response.text();
            setResult(data);
        } catch (error) {
            console.error(error);
            setResult('⚠️ Failed to generate email.');
        } finally {
            setLoading(false);
        }
    };

    const downloadAsDocx = () => {
        const html = `<html><body>${result.replace(/\n/g, "<br>")}</body></html>`;
        const blob = htmlDocx.asBlob(html);
        saveAs(blob, "Email_Writer.docx");
    };

    const downloadAsPdf = () => {
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(result, 180);
        doc.text(lines, 10, 10);
        doc.save("Email_Writer.pdf");
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
                <h1 className="text-3xl font-bold text-green-700">📧 AI Email Writer</h1>
                <button onClick={() => navigate('/writer/dashboard')} className="text-sm text-blue-500 underline">Back to Dashboard</button>
            </div>

            <div className="space-y-4">
                <select
                    value={emailType}
                    onChange={(e) => setEmailType(e.target.value)}
                    className="w-full p-3 border rounded-md"
                >
                    {emailTypes.map(type => (
                        <option key={type}>{type}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Describe product/service you're writing about"
                    value={productOrService}
                    onChange={(e) => setProductOrService(e.target.value)}
                    className="w-full p-3 border rounded-md"
                />

                <input
                    type="text"
                    placeholder="Who is the email for? (e.g., busy CEOs, new customers)"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-3 border rounded-md"
                />

                <button
                    onClick={handleGenerate}
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Email'}
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

export default EmailWriter;
