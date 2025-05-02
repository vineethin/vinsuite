import React, { useState } from 'react';
import API from "../../apiConfig";

const AutomatedTestGenerator = () => {
    const [testCase, setTestCase] = useState('');
    const [htmlCode, setHtmlCode] = useState('');
    const [language, setLanguage] = useState('Java');
    const [framework, setFramework] = useState('TestNG');
    const [generatedCode, setGeneratedCode] = useState('');

    const handleGenerate = async () => {
        try {
            const response = await fetch(`${API.FRAMEWORK}/automation/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testCase, htmlCode, language, framework }),
            });

            const result = await response.text();
            setGeneratedCode(result);
        } catch (error) {
            console.error('Error generating automation code:', error);
            setGeneratedCode('// Error: Unable to generate automation code.');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Automated Test Generator</h2>

            <label className="block font-medium mb-1">Manual Test Case</label>
            <textarea
                className="w-full border rounded p-2 mb-4 h-32"
                placeholder="Enter manual test case steps..."
                value={testCase}
                onChange={(e) => setTestCase(e.target.value)}
            />

            <label className="block font-medium mb-1">HTML Code</label>
            <textarea
                className="w-full border rounded p-2 mb-4 h-32"
                placeholder="Paste related HTML code..."
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
            />

            <div className="flex gap-4 mb-4">
                <div>
                    <label className="block font-medium mb-1">Language</label>
                    <select
                        className="border rounded p-2"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option>Java</option>
                        <option>Python</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Framework</label>
                    <select
                        className="border rounded p-2"
                        value={framework}
                        onChange={(e) => setFramework(e.target.value)}
                    >
                        <option>TestNG</option>
                        <option>JUnit</option>
                    </select>
                </div>
            </div>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleGenerate}
            >
                Generate Automation Script
            </button>

            {generatedCode && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Generated Script</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{generatedCode}</pre>
                </div>
            )}
        </div>
    );
};

export default AutomatedTestGenerator;
