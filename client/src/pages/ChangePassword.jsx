import { useState } from 'react';
import { Home } from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiClient } from '../lib/api-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const response = await apiClient.put('/api/auth/change-password', {
        username: user?.username,
        newPassword,
      });

      toast.success(response.data.message || 'Password updated successfully');

      setNewPassword('');
      setConfirmPassword('');

      // Redirect based on user role
      setTimeout(() => {
        if (user?.role === 'A') {
          navigate('/');
        } else {
          navigate(`/employeedashboard/${user?.username}`);
        }
      }, 2000); // Delay for toast
    } catch (error) {
      console.error('Change password error', error);
      toast.error(error?.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Change Password</h1>

          {/* Breadcrumb */}
          <div className="flex items-center text-gray-500 text-sm">
            <Home className="w-4 h-4 mr-1" />
            <span className="mr-2">/</span>
            <span className="text-gray-400">Change Password</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* New Password */}
            <div className="flex items-center">
              <label className="w-40 text-gray-700 font-medium">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className="flex-1 max-w-md px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center">
              <label className="w-40 text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter Confirm Password"
                className="flex-1 max-w-md px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center">
              <div className="w-40"></div>
              <button
                onClick={handleSubmit}
                className="bg-purple-800 hover:bg-purple-900 text-white font-medium px-8 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
