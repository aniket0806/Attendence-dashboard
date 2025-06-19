import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from '../../../lib/api-client';

const DesignationAdd = () => {
  const navigate = useNavigate();

  const [designationEn, setDesignationEn] = useState('');
  const [designationHi, setDesignationHi] = useState('');
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!designationEn.trim() || !designationHi.trim()) {
      toast.error('Both English and Hindi designation names are required');
      return false;
    }
    if (designationEn.length > 100 || designationHi.length > 100) {
      toast.error('Designation names must be under 100 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await apiClient.post('/api/auth/add-designation', {
        designation: designationEn.trim(),
        designation_other: designationHi.trim(),
        status: status ? 'active' : 'deactive',
      });

      toast.success('Designation added successfully');
      setTimeout(() => navigate('/masters/designation'), 1500);
    } catch (err) {
      console.error('Error adding designation:', err);
      toast.error('Failed to add designation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Add Designation</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 space-y-6">
            {/* English Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation Name
                </label>
                <span className="text-sm text-gray-500">[English]</span>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={designationEn}
                  onChange={(e) => setDesignationEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter designation name in English"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Hindi Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation Name [Hindi]
                </label>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={designationHi}
                  onChange={(e) => setDesignationHi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Designation Name in Hindi"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <span className="text-sm text-gray-500">[Active / Inactive]</span>
              </div>
              <div className="md:col-span-2 flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-start">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${
                  loading ? 'bg-purple-400' : 'bg-purple-700 hover:bg-purple-800'
                } text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
              >
                {loading ? 'Adding...' : 'Add Designation'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DesignationAdd;
