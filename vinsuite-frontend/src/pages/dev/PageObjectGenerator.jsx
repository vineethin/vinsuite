import React from 'react';
import LogoutButton from '../../components/LogoutButton';
import PageObjectTab from '../../components/testCaseGenerator/PageObjectTab';

const PageObjectGenerator = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center">
          📄 Page Object Generator
        </h1>
        <LogoutButton />
      </div>

      <PageObjectTab />
    </div>
  );
};

export default PageObjectGenerator;
