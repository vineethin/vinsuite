import React, { useState } from 'react';
import axios from 'axios';

import TabSwitcher from '../../components/testCaseGenerator/TabSwitcher';
import TextInputSection from '../../components/testCaseGenerator/TextInputSection';
import OCRInputSection from '../../components/testCaseGenerator/OCRInputSection';
import TestCaseTable from '../../components/testCaseGenerator/TestCaseTable';
import ExportButton from '../../components/testCaseGenerator/ExportButton';
import EditControls from '../../components/testCaseGenerator/EditControls';
import LogoutButton from '../../components/LogoutButton';

const TestCaseGenerator = () => {
  const [tab, setTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [originalTestCases, setOriginalTestCases] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isOCRTableEditable, setIsOCRTableEditable] = useState(false);

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setTestCases([]);
    setOriginalTestCases([]);
    setIsEditing(false);
    setIsOCRTableEditable(false);
    setInputText('');
    setImage(null);
    setImageBase64('');
  };

  const handleTextTestCaseGeneration = async () => {
    if (!inputText.trim()) return;
    try {
      const res = await axios.post('http://localhost:8081/api/ai/generate-test-cases', { feature: inputText });
      const result = res.data.testCases || [];
      setTestCases(result);
      setOriginalTestCases(result);
    } catch (error) {
      console.error('Error generating test cases from text:', error);
      alert('❌ Failed to generate test cases.');
    }
  };

  const handleOCRTestCaseGeneration = async () => {
    if (!imageBase64 && !inputText.trim()) {
      alert("❗ Please provide at least an image or a user story");
      return;
    }

    try {
      const res = await axios.post('http://localhost:8081/api/ai/generate-smart-test-cases', {
        featureText: inputText || "",
        imageBase64: imageBase64 || ""
      });
      const result = res.data.testCases || [];
      setTestCases(result);
      setOriginalTestCases(result);
      setIsOCRTableEditable(false);
    } catch (error) {
      console.error('❌ Failed OCR Gen:', error);
      alert('❌ Failed to generate test cases from input.');
    }
  };

  const handleEdit = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">🧠 TestGenie by VinSuite</h1>
        <LogoutButton />
      </div>

      <TabSwitcher activeTab={tab} onSwitch={handleTabSwitch} />

      {tab === 'text' && (
        <>
          <TextInputSection
            inputText={inputText}
            setInputText={setInputText}
          />
          <div className="mt-4">
            <button
              onClick={handleTextTestCaseGeneration}
              className="px-6 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            >
              Generate Test Cases
            </button>
          </div>
        </>
      )}

      {tab === 'ocr' && (
        <>
          <OCRInputSection
            image={image}
            imageBase64={imageBase64}
            setImage={setImage}
            setImageBase64={setImageBase64}
          />
          <TextInputSection
            inputText={inputText}
            setInputText={setInputText}
          />
          <div className="mt-4">
            <button
              onClick={handleOCRTestCaseGeneration}
              className="px-6 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            >
              Generate Test Cases
            </button>
          </div>
        </>
      )}

      {(tab === 'text' || tab === 'ocr') && testCases.length > 0 && (
        <>
          <EditControls
            isEditing={tab === 'text' ? isEditing : isOCRTableEditable}
            setIsEditing={tab === 'text' ? setIsEditing : setIsOCRTableEditable}
            handleSave={() => {
              setOriginalTestCases(testCases);
              tab === 'text' ? setIsEditing(false) : setIsOCRTableEditable(false);
            }}
          />
          <TestCaseTable
            testCases={testCases}
            editable={tab === 'text' ? isEditing : isOCRTableEditable}
            onEdit={handleEdit}
          />
          <ExportButton testCases={testCases} />
        </>
      )}
    </div>
  );
};

export default TestCaseGenerator;
