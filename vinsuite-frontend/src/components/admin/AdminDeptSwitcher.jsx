import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDeptSwitcher = () => {
    const navigate = useNavigate();
    const [isChanging, setIsChanging] = useState(false);
    const [selectedDept, setSelectedDept] = useState(localStorage.getItem('userDepartment') || '');

    const handleChangeClick = () => setIsChanging(true);
    const handleSelectChange = (e) => setSelectedDept(e.target.value);

    const handleConfirm = () => {
        if (!selectedDept) {
            alert('Please select a department');
            return;
        }

        localStorage.setItem('userDepartment', selectedDept);

        // Navigate to correct admin route
        switch (selectedDept) {
            case 'IT': navigate('/admin/it'); break;
            case 'Finance': navigate('/admin/finance'); break;
            case 'Trader': navigate('/admin/trader'); break;
            case 'Support': navigate('/admin/support'); break;
            case 'Sales': navigate('/admin/sales'); break;
            default: navigate('/admin'); break;
        }
    };

    return (
        <div className="mt-2">
            {!isChanging ? (
                <div className="flex items-center space-x-4">
                    <p className="text-lg font-medium">Department: <span className="font-bold">{selectedDept}</span></p>
                    <button
                        onClick={handleChangeClick}
                        className="text-blue-600 underline text-sm"
                    >
                        Change Department
                    </button>
                </div>
            ) : (
                <div className="flex space-x-2 mt-2">
                    <select
                        value={selectedDept}
                        onChange={handleSelectChange}
                        className="border px-3 py-1 rounded"
                    >
                        <option value="">-- Select --</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Trader">Trader</option>
                        <option value="Support">Support</option>
                        <option value="Sales">Sales</option>
                    </select>
                    <button
                        onClick={handleConfirm}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                        Confirm
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDeptSwitcher;
