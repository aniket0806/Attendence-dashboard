// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { apiClient } from '../../../lib/api-client';

// const WorkLocationAdd = () => {
//   const navigate = useNavigate();

//   const [orgCode, setOrgCode] = useState('');
//   const [workLocation, setWorkLocation] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [officePic, setOfficePic] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     if (!orgCode || !workLocation || !latitude || !longitude || !officePic) {
//       toast.error('All fields including image are required');
//       return false;
//     }
//     if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
//       toast.error('Latitude and Longitude must be numbers');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     const formData = new FormData();
//     formData.append('org_code', orgCode);
//     formData.append('worklocation', workLocation);
//     formData.append('latitude', latitude);
//     formData.append('longitude', longitude);
//     formData.append('office_pic', officePic);

//     try {
//       setLoading(true);
//       await apiClient.post('/api/auth/add-worklocation', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       toast.success('Work location added');
//       setTimeout(() => navigate('/masters/worklocation'), 1500);
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error('Failed to add work location');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <h1 className="text-xl font-semibold text-gray-900">Add Work Location</h1>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
//           <InputRow label="Org Code" value={orgCode} onChange={(e) => setOrgCode(e.target.value)} />
//           <InputRow label="Work Location" value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} />
//           <InputRow label="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
//           <InputRow label="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />

//           {/* Image Upload */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Office Picture</label>
//             </div>
//             <div className="md:col-span-2">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setOfficePic(e.target.files[0])}
//                 className="w-full"
//               />
//             </div>
//           </div>

//           <div className="flex justify-start">
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className={`${
//                 loading ? 'bg-purple-400' : 'bg-purple-700 hover:bg-purple-800'
//               } text-white font-medium py-2 px-6 rounded-md transition-colors duration-200`}
//             >
//               {loading ? 'Adding...' : 'Add Work Location'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// const InputRow = ({ label, value, onChange }) => (
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     </div>
//     <div className="md:col-span-2">
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   </div>
// );

// export default WorkLocationAdd;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClient } from '../../../lib/api-client';

const WorkLocationAdd = () => {
  const navigate = useNavigate();

  const [orgCode, setOrgCode] = useState('');
  const [workLocationCode, setWorkLocationCode] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [officePic, setOfficePic] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!orgCode || !workLocationCode || !workLocation || !latitude || !longitude || !officePic) {
      toast.error('All fields including image are required');
      return false;
    }
    if (isNaN(parseFloat(latitude))) { 
      toast.error('Latitude must be a number');
      return false;
    }
    if (isNaN(parseFloat(longitude))) {
      toast.error('Longitude must be a number');
      return false;
    }
    return true;
  };

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

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append('org_code', orgCode);
    formData.append('wl_code', workLocationCode);
    formData.append('worklocation', workLocation);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('office_pic', officePic);
// for (const pair of formData.entries()) {
//   console.log(`${pair[0]}:`, pair[1]);
// }

    try {
      setLoading(true);
      await apiClient.post('/api/auth/add-worklocation', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Work location added successfully');
      setTimeout(() => navigate('/masters/worklocation'), 1500);
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add work location';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Add Work Location</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <InputRow label="Org Code" value={orgCode} onChange={(e) => setOrgCode(e.target.value)} />
          <InputRow label="worklocation code" value={workLocationCode} onChange={(e) => setWorkLocationCode(e.target.value)} />
          <InputRow label="Work Location" value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} />
          <InputRow label="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          <InputRow label="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />

          {/* Enhanced Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Picture</label>
              <p className="text-xs text-gray-500">JPG, PNG (Max 5MB)</p>
            </div>
            <div className="md:col-span-2 space-y-2">
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
              {previewImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-start pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${
                loading ? 'bg-purple-400' : 'bg-purple-700 hover:bg-purple-800'
              } text-white font-medium py-2 px-6 rounded-md transition-colors duration-200`}
            >
              {loading ? 'Adding...' : 'Add Work Location'}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

const InputRow = ({ label, value, onChange }) => (
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
      />
    </div>
  </div>
);

export default WorkLocationAdd;
