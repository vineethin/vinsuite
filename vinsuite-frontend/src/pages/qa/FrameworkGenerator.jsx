import React, { useState } from "react";
import axios from "axios";
import API from "../../apiConfig";

const FrameworkGenerator = () => {
    const [language, setLanguage] = useState("java");
    const [testFramework, setTestFramework] = useState("testng");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API.QA}/framework/generate`, {
                language,
                testFramework,
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sample-framework.zip');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert("❌ Failed to generate framework");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold text-center mb-4">🛠️ Framework Generator</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="csharp">C#</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Test Framework</label>
                        <select
                            value={testFramework}
                            onChange={(e) => setTestFramework(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="testng">TestNG</option>
                            <option value="junit">JUnit</option>
                            <option value="pytest">PyTest</option>
                        </select>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`w-full py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? "Generating..." : "Download Framework"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrameworkGenerator;
