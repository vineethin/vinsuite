// src/components/testCaseGenerator/EditControls.jsx
import React from 'react';

const EditControls = ({ isEditing, setIsEditing }) => {
  return (
    <div className="flex space-x-2 mt-4">
      {isEditing ? (
        <>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default EditControls;
