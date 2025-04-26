import React from 'react';
import * as XLSX from 'xlsx';

const ExportButton = ({ testCases }) => {
  const exportToExcel = () => {
    const data = testCases.map((tc, index) => ({
      'Sl. No.': index + 1,
      Action: tc.action,
      'Expected Result': tc.expectedResult,
      'Actual Result': tc.actualResult || '',
      Comments: tc.comments || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TestCases');

    XLSX.writeFile(workbook, 'TestCases.xlsx');
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded mt-4"
    >
      Export to Excel
    </button>
  );
};

export default ExportButton;
