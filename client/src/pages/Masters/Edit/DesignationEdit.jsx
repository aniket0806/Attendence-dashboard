import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from '../../../lib/api-client';
const DesignationEdit = () => {
const { id } = useParams();
  const navigate = useNavigate();

  const [designationNameEn, setDesignationNameEn] = useState('');
  const [designationNameHi, setDesignationNameHi] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(true); 


  // Fetch designation by ID
  const fetchdesignation = async () => {
    try {
      const { data } = await apiClient.get('/api/auth/designation');
const dept = data.find((d) => String(d.id) === String(id));
if (!dept) {
  toast.error('designation not found');
  return;
}
setDesignationNameEn(dept.designation || '');
setDesignationNameHi(dept.designation_other || '');
setStatus(dept.status === 1); // Assuming 1 = active, 0 = inactive

    } catch (err) {
      console.error('Error fetching designation:', err);
      // toast.error('Failed to load designation data');
    }
  };

  useEffect(() => {
    fetchdesignation();
  }, [id]);

  // Form validation
  const validate = () => {
    if (!designationNameEn.trim() || !designationNameHi.trim()) {
      toast.error('Both English and Hindi designation names are required');
      return false;
    }
    if (designationNameEn.length > 100 || designationNameHi.length > 100) {
      toast.error('designation names must be under 100 characters');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await apiClient.put(`/api/auth/designation/${id}`, {
        designation: designationNameEn.trim(),
        designation_other: designationNameHi.trim(),
        status: status ? 1 : 0,
      });

      toast.success('Designation updated successfully');

      // Optional refresh from backend
      await fetchdesignation();

      // Redirect after success
      setTimeout(() => navigate('/masters/designation'), 1500);
    } catch (err) {
      console.error('Error updating designation:', err);
      toast.error('Failed to update designation');
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
            <h1 className="text-xl font-semibold text-gray-900">Edit designation</h1>
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
                  designation Name
                </label>
                <span className="text-sm text-gray-500">[English]</span>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={designationNameEn}
                  onChange={(e) => setDesignationNameEn(e.target.value)}
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
                  designation Name [Hindi]
                </label>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={designationNameHi}
                  onChange={(e) => setDesignationNameHi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="designation Name in Hindi"
                  maxLength={100}
                />
              </div>
            </div>
          {/* Status Checkbox */}
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

            {/* Update Button */}
            <div className="flex justify-start">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`${
                  loading ? 'bg-purple-400' : 'bg-purple-700 hover:bg-purple-800'
                } text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
              >
                {loading ? 'Updating...' : 'Update designation'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default DesignationEdit;