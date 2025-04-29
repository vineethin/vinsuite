import React, { useState } from "react";
import axios from "axios";
import API from '../../apiConfig'; // ✅ import centralized API config

import TabSwitcher from "../../components/testCaseGenerator/TabSwitcher";
import TextInputSection from "../../components/testCaseGenerator/TextInputSection";
import OCRInputSection from "../../components/testCaseGenerator/OCRInputSection";
import TestCaseTable from "../../components/testCaseGenerator/TestCaseTable";
import ExportButton from "../../components/testCaseGenerator/ExportButton";
import EditControls from "../../components/testCaseGenerator/EditControls";
import LogoutButton from "../../components/LogoutButton";

const TestCaseGenerator = () => {
  const [tab, setTab] = useState("text");
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isOCRTableEditable, setIsOCRTableEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setTestCases([]);
    setIsEditing(false);
    setIsOCRTableEditable(false);
    setInputText("");
    setImage(null);
    setImageBase64("");
  };

  const handleTextTestCaseGeneration = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API.TEST_CASES}/generate-test-cases`, {
        feature: inputText
      });
      const raw = res.data.testCases;
      const result = typeof raw === "string" ? JSON.parse(raw) : raw;
      setTestCases(result);
    } catch (error) {
      console.error("Error generating test cases from text:", error);
      alert("❌ Failed to generate test cases.");
    } finally {
      setLoading(false);
    }
  };

  const handleOCRTestCaseGeneration = async () => {
    if (!imageBase64 && !inputText.trim()) {
      alert("❗ Please provide at least an image or a user story");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API.TEST_CASES}/generate-test-cases`, {
        feature: inputText || "Extracted text from image"
      });
      const raw = res.data.testCases;
      const result = typeof raw === "string" ? JSON.parse(raw) : raw;
      setTestCases(result);
      setIsOCRTableEditable(false);
    } catch (error) {
      console.error("❌ Failed OCR Gen:", error);
      alert("❌ Failed to generate test cases from input.");
    } finally {
      setLoading(false);
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

      {tab === "text" && (
        <>
          <TextInputSection inputText={inputText} setInputText={setInputText} />
          <div className="mt-4">
            <button
              onClick={handleTextTestCaseGeneration}
              disabled={loading}
              className={`px-6 py-2 font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded shadow flex items-center justify-center`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate Test Cases"
              )}
            </button>
          </div>
        </>
      )}

      {tab === "ocr" && (
        <>
          <div className="bg-yellow-100 text-yellow-800 text-center p-2 rounded mb-4 shadow">
            ✨ Smart OCR + Text Mode Activated. Upload an image or paste a user story to generate test cases!
          </div>

          <OCRInputSection
            image={image}
            imageBase64={imageBase64}
            setImage={setImage}
            setImageBase64={setImageBase64}
          />
          <TextInputSection inputText={inputText} setInputText={setInputText} />
          <div className="mt-4">
            <button
              onClick={handleOCRTestCaseGeneration}
              disabled={loading}
              className={`px-6 py-2 font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded shadow flex items-center justify-center`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate Test Cases"
              )}
            </button>
          </div>
        </>
      )}

      {(tab === "text" || tab === "ocr") && testCases.length > 0 && (
        <>
          <EditControls
            isEditing={tab === "text" ? isEditing : isOCRTableEditable}
            setIsEditing={tab === "text" ? setIsEditing : setIsOCRTableEditable}
            handleSave={() => {
              tab === "text" ? setIsEditing(false) : setIsOCRTableEditable(false);
            }}
          />
          <TestCaseTable
            testCases={testCases}
            editable={tab === "text" ? isEditing : isOCRTableEditable}
            onEdit={handleEdit}
          />
          <ExportButton testCases={testCases} />
        </>
      )}
    </div>
  );
};

export default TestCaseGenerator;
