import React from 'react';
import ToolHeader from '../../components/common/ToolHeader';

const TestMyPage = () => {
  console.log("✅ TestMyPage loaded");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToolHeader title="Test My Page" />
      <h1 className="text-2xl text-green-600 mt-4">✅ TestMyPage is working!</h1>
    </div>
  );
};

export default TestMyPage;
