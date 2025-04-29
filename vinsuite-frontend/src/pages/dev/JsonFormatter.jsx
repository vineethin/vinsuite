import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const prettyJson = JSON.stringify(parsed, null, 2);
      setFormattedJson(prettyJson);
      setErrorMessage('');
    } catch (error) {
      setFormattedJson('');
      setErrorMessage('Invalid JSON. Please fix syntax errors.');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(inputJson);
      setErrorMessage('✅ Valid JSON!');
    } catch (error) {
      setErrorMessage('❌ Invalid JSON!');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">🧹 JSON Formatter & Validator</h2>

      <textarea
        className="w-full h-48 p-2 border rounded-md text-sm font-mono"
        placeholder="Paste your JSON here..."
        value={inputJson}
        onChange={(e) => setInputJson(e.target.value)}
      />

      <div className="flex space-x-2">
        <Button onClick={handleFormat}>Format</Button>
        <Button onClick={handleValidate} variant="outline">Validate</Button>
      </div>

      {errorMessage && (
        <div className="text-red-600 font-medium mt-2">{errorMessage}</div>
      )}

      {formattedJson && (
        <Card className="mt-4">
          <CardContent>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{formattedJson}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonFormatter;
