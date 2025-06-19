import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../lib/api-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepartmentsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [departmentNameEn, setDepartmentNameEn] = useState('');
  const [departmentNameHi, setDepartmentNameHi] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(true); // true = active, false = inactive


  // Fetch department by ID
  const fetchDepartment = async () => {
    try {
      const { data } = await apiClient.get('/api/auth/department');
const dept = data.find((d) => String(d.id) === String(id));
if (!dept) {
  toast.error('Department not found');
  return;
}
setDepartmentNameEn(dept.department_name || '');
setDepartmentNameHi(dept.department_name_hi || '');
setStatus(dept.status === 1); // Assuming 1 = active, 0 = inactive

    } catch (err) {
      console.error('Error fetching department:', err);
      // toast.error('Failed to load department data');
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  // Form validation
  const validate = () => {
    if (!departmentNameEn.trim() || !departmentNameHi.trim()) {
      toast.error('Both English and Hindi department names are required');
      return false;
    }
    if (departmentNameEn.length > 100 || departmentNameHi.length > 100) {
      toast.error('Department names must be under 100 characters');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await apiClient.put(`/api/auth/departments/${id}`, {
        department_name: departmentNameEn.trim(),
        department_name_hi: departmentNameHi.trim(),
         status: status ? 1 : 0,
      });

      toast.success('Department updated successfully');

      // Optional refresh from backend
      await fetchDepartment();

      // Redirect after success
      setTimeout(() => navigate('/masters/departments'), 1500);
    } catch (err) {
      console.error('Error updating department:', err);
      toast.error('Failed to update department');
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
            <h1 className="text-xl font-semibold text-gray-900">Edit Department</h1>
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
                  Department Name
                </label>
                <span className="text-sm text-gray-500">[English]</span>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={departmentNameEn}
                  onChange={(e) => setDepartmentNameEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department name in English"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Hindi Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name [Hindi]
                </label>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={departmentNameHi}
                  onChange={(e) => setDepartmentNameHi(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Department Name in Hindi"
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
                {loading ? 'Updating...' : 'Update Department'}
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

export default DepartmentsEdit;
