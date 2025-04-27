import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BackupCheck = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://vinsuite.onrender.com/api/dba/backup-status')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold text-blue-700 mb-4">💾 Backup Status Checker</h2>

        <table className="w-full table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Server</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Last Run</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{item.server}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="border px-4 py-2">{item.lastRun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BackupCheck;
