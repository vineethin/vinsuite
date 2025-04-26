// ✅ Cleaned-up OCRInputSection.jsx (no generate button)
import React, { useState } from 'react';
import PastedImageInput from './PastedImageInput';

const OCRInputSection = ({ image, setImage, imageBase64, setImageBase64 }) => {
  const [dragOver, setDragOver] = useState(false);

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
    </div>
  );
};

export default OCRInputSection;