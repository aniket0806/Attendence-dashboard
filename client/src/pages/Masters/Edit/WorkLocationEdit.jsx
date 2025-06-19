import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from '../../../lib/api-client';
import { HOST } from '../../../utils/constants';

const WorkLocationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orgCode, setOrgCode] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [officePic, setOfficePic] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWorkLocation = async () => {
    try {
      const { data } = await apiClient.get('/api/auth/worklocation');
      const location = data.find((loc) => String(loc.id) === String(id));
      if (!location) {
        toast.error('Work location not found');
        return;
      }

      setOrgCode(location.org_code || '');
      setWorkLocation(location.worklocation || '');
      setLatitude(location.latitude || '');
      setLongitude(location.longitude || '');
      setCurrentImage(location.office_pic || '');
    } catch (err) {
      console.error('Error fetching work location:', err);
      toast.error('Failed to load work location data');
    }
  };

  useEffect(() => {
    fetchWorkLocation();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, and PNG files are allowed');
      return;
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setOfficePic(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setOfficePic(null);
    setPreviewImage('');
  };

  const validate = () => {
    if (!orgCode.trim() || !workLocation.trim() || !latitude.trim() || !longitude.trim()) {
      toast.error('All fields are required');
      return false;
    }

    if (
      orgCode.length > 100 ||
      workLocation.length > 100 ||
      latitude.length > 25 ||
      longitude.length > 25
    ) {
      toast.error('One or more fields exceed the maximum length');
      return false;
    }

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      toast.error('Latitude and Longitude must be valid numbers');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append('org_code', orgCode.trim());
    formData.append('worklocation', workLocation.trim());
    formData.append('latitude', latitude.trim());
    formData.append('longitude', longitude.trim());
  if (officePic) {
  formData.append('office_pic', officePic);
} else {
  formData.append('existing_image', currentImage);
}

    try {
      setLoading(true);
      await apiClient.put(`/api/auth/worklocation/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Work location updated successfully');
      setTimeout(() => navigate('/masters/worklocation'), 1500);
    } catch (err) {
      console.error('Error updating work location:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update work location';
      toast.error(errorMessage);
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
            <h1 className="text-xl font-semibold text-gray-900">Edit Work Location</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 space-y-6">
            {/* Org Code */}
            <InputRow
              label="Org Code"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
              placeholder="Enter org code"
              maxLength={100}
            />

            {/* Work Location */}
            <InputRow
              label="Work Location"
              value={workLocation}
              onChange={(e) => setWorkLocation(e.target.value)}
              placeholder="Enter work location"
              maxLength={100}
            />

            {/* Latitude */}
            <InputRow
              label="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Enter latitude"
              maxLength={25}
            />

            {/* Longitude */}
            <InputRow
              label="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Enter longitude"
              maxLength={25}
            />

            {/* Image Upload */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Office Picture
                </label>
                <p className="text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                {/* Current Image */}
             {currentImage && !previewImage && (
  <div className="flex flex-col space-y-2">
    <p className="text-sm text-gray-600">Current Image:</p>
    <img
      src={
        currentImage.startsWith('http')
          ? currentImage
          : `${HOST}/uploads/worklocation/${currentImage}`
      }
      alt="Current office"
      className="h-32 w-32 object-cover rounded-md border"
      onError={(e) => {
        e.target.onerror = null;
        
      }}
    />
  </div>
)}


                {/* Preview Image */}
               {previewImage && (
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-600">New Image Preview:</p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )} 

                {/* File Input */}
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                />
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-start pt-4">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`${
                  loading ? 'bg-purple-400' : 'bg-purple-700 hover:bg-purple-800'
                } text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
              >
                {loading ? 'Updating...' : 'Update Work Location'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

const InputRow = ({ label, value, onChange, placeholder, maxLength }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    </div>
    <div className="md:col-span-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  </div>
);

export default WorkLocationEdit;