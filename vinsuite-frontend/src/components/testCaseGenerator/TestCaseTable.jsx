// src/components/testCaseGenerator/TestCaseTable.jsx
import React from 'react';

const TestCaseTable = ({ testCases, editable, onEdit }) => {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 border">Sl. No</th>
            <th className="py-2 px-4 border">Action</th>
            <th className="py-2 px-4 border">Expected Result</th>
            <th className="py-2 px-4 border">Actual Result</th>
            <th className="py-2 px-4 border">Comments</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border text-center">{index + 1}</td>

              <td className="py-2 px-4 border">
                {editable ? (
                  <input
                    type="text"
                    value={testCase.action}
                    onChange={(e) => onEdit(index, 'action', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  testCase.action
                )}
              </td>

              <td className="py-2 px-4 border">
                {editable ? (
                  <input
                    type="text"
                    value={testCase.expectedResult}
                    onChange={(e) => onEdit(index, 'expectedResult', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  testCase.expectedResult
                )}
              </td>

              <td className="py-2 px-4 border">{testCase.actualResult || ''}</td>
              <td className="py-2 px-4 border">{testCase.comments || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCaseTable;
