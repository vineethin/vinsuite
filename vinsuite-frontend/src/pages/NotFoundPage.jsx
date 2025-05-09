import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-700">Oops! Page not found.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
