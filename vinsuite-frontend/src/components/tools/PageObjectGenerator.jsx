import React, { useState } from 'react';
import ElementIdentifier from '../../components/tools/ElementIdentifier';
import PageObjectFromText from '../../components/tools/PageObjectFromText';

const PageObjectGenerator = () => {
  const [tab, setTab] = useState('text');

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Page Object Generator</h2>

      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            tab === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setTab('text')}
        >
          From HTML
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setTab('image')}
        >
          From Screenshot
        </button>
      </div>

      <div>
        {tab === 'text' ? <PageObjectFromText /> : <ElementIdentifier />}
      </div>
    </div>
  );
};

export default PageObjectGenerator;
