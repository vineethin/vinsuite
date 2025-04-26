// ✅ Cleaned-up TextInputSection.jsx (no button)
import React from 'react';

const TextInputSection = ({ inputText, setInputText }) => {
  return (
    <div className="mt-6">
      <label className="block text-gray-700 font-medium mb-1">
        📝 Enter Feature Description:
      </label>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Describe your feature or scenario here..."
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        rows={5}
      ></textarea>
    </div>
  );
};

export default TextInputSection;
