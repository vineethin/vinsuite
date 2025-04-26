import React from 'react';

const tabs = [
  { id: 'text', label: 'Text Input' },
  { id: 'ocr', label: 'OCR Input' }
];

const TabSwitcher = ({ activeTab, onSwitch }) => {
  return (
    <div className="flex space-x-4 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSwitch(tab.id)}
          className={`py-2 px-4 font-semibold transition-colors duration-200 ${
            activeTab === tab.id
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
