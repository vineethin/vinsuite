import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

const AdminDeptSwitcher = () => {
  const navigate = useNavigate();
  const { userDepartment, setUserDepartment } = useApp();
  const [isChanging, setIsChanging] = useState(false);
  const [selectedDept, setSelectedDept] = useState(userDepartment || "");

  const handleChangeClick = () => setIsChanging(true);

  const handleSelectChange = (e) => setSelectedDept(e.target.value);

  const handleConfirm = () => {
    if (!selectedDept) {
      alert("Please select a department");
      return;
    }

    setUserDepartment(selectedDept);
    localStorage.setItem("userDepartment", selectedDept);

    const targetPath = `/admin/${selectedDept.toLowerCase()}`;
    if (window.location.pathname === targetPath) {
      window.location.reload();
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="mt-2">
      {!isChanging ? (
        <div className="flex items-center gap-4">
          <p className="text-lg font-medium">
            Department: <span className="font-bold">{selectedDept}</span>
          </p>
          <button
            onClick={handleChangeClick}
            className="text-sm text-blue-600 underline"
          >
            Change Department
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor="department-select" className="sr-only">
            Select Department
          </label>
          <select
            id="department-select"
            value={selectedDept}
            onChange={handleSelectChange}
            className="border px-3 py-1 rounded focus:outline-blue-500"
            aria-label="Select Department"
          >
            <option value="">-- Select --</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Trader">Trader</option>
            <option value="Support">Support</option>
            <option value="Sales">Sales</option>
            <option value="Writer">Writer</option> {/* ✅ Added */}
          </select>
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition duration-200"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDeptSwitcher;
