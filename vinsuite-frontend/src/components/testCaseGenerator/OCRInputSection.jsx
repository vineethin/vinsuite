import React, { useState } from 'react';
import PastedImageInput from './PastedImageInput';
import API from '../../apiConfig';

const OCRInputSection = ({ image, setImage, imageBase64, setImageBase64, setTestCases }) => {
  const [dragOver, setDragOver] = useState(false);
  const [featureDescription, setFeatureDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImagePaste = (base64Image) => {
    setImage(null); // reset file input image
    setImageBase64(base64Image);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleGenerate = async () => {
    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    } else if (imageBase64) {
      const blob = await fetch(imageBase64).then(res => res.blob());
      formData.append("image", blob, "pasted-image.png");
    } else {
      alert("Please upload or paste an image.");
      return;
    }

    if (!featureDescription.trim()) {
      alert("Please enter a feature description.");
      return;
    }

    formData.append("feature", featureDescription);

    try {
      setLoading(true);
      const response = await fetch(`${API.BASE_URL}/vision/generate-ocr-testcases`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.testCases) {
        setTestCases(result.testCases);
      } else {
        alert(result.error || "No test cases returned.");
      }
    } catch (err) {
      console.error("❌ Error generating test cases:", err);
      alert("Failed to generate test cases.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-6">
      <div
        className={`border-2 border-dashed p-6 rounded-lg transition-all duration-200 ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="block text-gray-700 mb-2 font-medium">Upload Snapshot (or drag & drop):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
        <PastedImageInput onImagePaste={handleImagePaste} />
      </div>

      {imageBase64 && (
        <div className="mt-4">
          <p className="text-gray-700 font-medium mb-1">📷 Image Preview:</p>
          <img src={imageBase64} alt="Uploaded or Pasted Preview" className="max-w-full h-auto rounded border" />
        </div>
      )}

      <div className="mt-6">
        <label className="block text-gray-700 mb-2 font-medium">Enter Feature Description:</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          rows={4}
          placeholder="Describe your feature or scenario here..."
          value={featureDescription}
          onChange={(e) => setFeatureDescription(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-6 py-2 font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded shadow flex items-center justify-center`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Generating...</span>
            </div>
          ) : (
            "Generate Test Cases"
          )}
        </button>
      </div>
    </div>
  );
};

export default OCRInputSection;
