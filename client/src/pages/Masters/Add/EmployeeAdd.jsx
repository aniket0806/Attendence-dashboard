import { useState, useEffect, useRef } from 'react';
import { Home, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DEPARTMENT_ROUTE, DESIGNATION_ROUTE, WORKLOCATION_ROUTE } from '../../../utils/constants';
import { apiClient } from '../../../lib/api-client';
import { useNavigate } from 'react-router-dom';
const EmployeeAdd = () => {
  const [formData, setFormData] = useState({
    titlePrefix: 'Shri',
    fullNameEnglish: '',
    fullNameHindi: '',
    contactNo: '',
    email: '',
    department: '',
    designation: '',
    state: '',
    district: '',
    reportingOfficer: '',
    usertype: 'Employee',
    workLocation: 'NHDC Bhopal Corporate Office',
    loginName: '',
    password: '',
    profileEdit: '',
    changeWorkLocation: '',
    profile_img:''
  });
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [workLocations, setWorkLocations] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
   const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
   const [loadingDistricts, setLoadingDistricts] = useState(false);
   const navigate = useNavigate(); 
  const formRef = useRef(null);
    const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
    fetchWorkLocations();
    fetchStates();
  }, []);

 const fetchDepartments = async () => {
  try {
    const response = await apiClient.get(DEPARTMENT_ROUTE); 
    const data = response.data;
    setDepartments(data);
  } catch (error) {
    toast.error('Failed to fetch departments');
    console.error(error); 
  }
};

  const fetchDesignations = async () => {
    try {
      const response = await apiClient.get(DESIGNATION_ROUTE);
      const data = await response.data;
      setDesignations(data);
    } catch (error) {
      toast.error('Failed to fetch designations');
      console.error(error);
    }
  };

  const fetchWorkLocations = async () => {
    try {
      const response = await apiClient.get(WORKLOCATION_ROUTE);
      const data = await response.data;
      setWorkLocations(data);
    } catch (error) {
      toast.error('Failed to fetch work locations');
      console.error(error);
    }
  };


  const fetchStates = async () => {
    try {
      const response = await apiClient.get('/api/auth/states');
const { data } = response.data; // Extract data from { success, data }
setStates(data);
      
      // Set default state if data exists
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, districts: data[0].state_name }));
        fetchDistricts(data[0].state_name); // Fetch districts for the first state
      }
    } catch (error) {
      toast.error('Failed to fetch states');
    }
  };

const fetchDistricts = async (stateName) => {
  if (!stateName) return;

  setLoadingDistricts(true);
  try {
    const response = await apiClient.get(`api/auth/districts/state/${stateName}`);
    const result = response.data;
   
    if (result.success && result.data) {
      setDistricts(result.data);

      // Optional: default to first district
      if (result.data.length > 0) {
        setFormData(prev => ({ ...prev, district: result.data[0].district }));
      } else {
        setFormData(prev => ({ ...prev, district: '' }));
      }
    } else {
      toast.error(result.message || 'No districts found');
      setDistricts([]);
      setFormData(prev => ({ ...prev, district: '' }));
    }
  } catch (error) {
    toast.error('Failed to fetch districts');
    console.error('District fetch error:', error);
  } finally {
    setLoadingDistricts(false);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG files are allowed');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setProfilePictureFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

   const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData(prev => ({ ...prev, state: selectedState, district: '' }));
    fetchDistricts(selectedState);
  };



  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePictureFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const {
      fullNameEnglish,
      contactNo,
      email,
      department,
      designation,
      loginName,
      password
    } = formData;

    if (!fullNameEnglish || !contactNo || !email || !department || !designation || !loginName || !password) {
      toast.error('Please fill all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(contactNo)) {
      toast.error('Invalid contact number');
      return false;
    }

    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    if (profilePictureFile) {
      formDataToSend.append('profile_img', profilePictureFile);
    }

    const response = await apiClient.post(
      '/api/auth/add-employee',
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      toast.success('Employee created successfully!');
      formRef.current.reset();
      setFormData({
        titlePrefix: 'Shri',
        fullNameEnglish: '',
        fullNameHindi: '',
        contactNo: '',
        email: '',
        department: '',
        designation: '',
        state: 'Madhya Pradesh',
        district: 'Bhopal',
        reportingOfficer: '',
        usertype: 'Employee',
        workLocation: 'NHDC Bhopal Corporate Office',
        loginName: '',
        password: '',
        profileEdit: '',
        changeWorkLocation: '',
        profile_img: ''
      });
      setProfilePicture(null);
      setProfilePictureFile(null);

      setTimeout(() => {
        navigate("/masters/employees");
      }, 1500);
    } else {
      toast.error('Error creating employee');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Server error. Try again later.');
  }
};
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {/* Header and Form Layout */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Add Employee</h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span>/</span>
            <Users className="w-4 h-4" />
            <span>Employees</span>
            <span>/</span>
            <span className="text-gray-900">Add Employee</span>
          </nav>
        </div>
      </div>

      {/* Form Content */}
      <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Full Name In English */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name In English</label>
             <div className="flex space-x-2">
                <select 
                 name="titlePrefix"
value={formData.titlePrefix}
onChange={handleInputChange}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Shri">Shri</option>
                  <option value="Smt">Smt</option>
                  <option value="Dr">Dr</option>
                </select>
                <input
                  type="text"
                  name="fullNameEnglish"
                  value={formData.fullNameEnglish}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Full Name In Hindi */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name In Hindi</label>
              <div className="flex space-x-2">
                <button 
                  type="button"
                  className="w-12 h-10 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-gray-600"
                >
                  अ
                </button>
                <input
                  type="text"
                  name="fullNameHindi"
                  value={formData.fullNameHindi}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Contact No</label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.department_name}>{dept.department_name }</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Designation</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation.designation}>{designation.designation}</option>
                ))}
              </select>
            </div>

            {/* State */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div> */}
            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {states.length > 0 ? (
                states.map((state) => (
                  <option key={state.state_name} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))
              ) : (
                <option value="">Loading states...</option>
              )}
            </select>
          </div>

            {/* District */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Bhopal">Bhopal</option>
                <option value="Indore">Indore</option>
                <option value="Jabalpur">Jabalpur</option>
              </select>
            </div> */}

            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loadingDistricts || districts.length === 0}
            >
              {loadingDistricts ? (
                <option value="">Loading districts...</option>
              ) : districts.length > 0 ? (
                districts.map((district) => (
                  <option key={district.id} value={district.district}>
                    {district.district}
                  </option>
                ))
              ) : (
                <option value="">No districts available</option>
              )}
            </select>
              </div>
            {/* Reporting Officer */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reporting Officer</label>
              <select
                name="reportingOfficer"
                value={formData.reportingOfficer}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select RO</option>
                <option value="Officer 1">Officer 1</option>
                <option value="Officer 2">Officer 2</option>
              </select>
            </div>

            {/* Usertype */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Usertype</label>
              <select
                name="usertype"
                value={formData.usertype}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            {/* Work Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Work Location</label>
              <select
                name="workLocation"
                value={formData.workLocation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="NHDC Bhopal Corporate Office">NHDC Bhopal Corporate Office</option>
                {workLocations.map((location, index) => (
                  <option key={index} value={location.worklocation}>{location.worklocation}</option>
                ))}
              </select>
            </div>

            {/* Picture */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div>
               <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                    id="picture-upload"
                    ref={fileInputRef}
                  />
                <label 
                  htmlFor="picture-upload"
                  className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Choose File
                </label>
                {profilePictureFile && (
                  <span className="ml-2 text-sm text-gray-500">
                      {profilePictureFile.name}
                    </span>
                     )}
                </div>
                   {profilePicture ? (
                  <div className="relative">
                    <img 
                      src={profilePicture} 
                      alt="Profile Preview" 
                      className="w-16 h-16 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md border border-gray-300 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
              </div>
               <p className="text-xs text-gray-500 mt-1">
                Accepted formats: JPG, PNG. Max size: 5MB
              </p>
            </div>

            {/* Login Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Login Name</label>
              <input
                type="text"
                name="loginName"
                value={formData.loginName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Profile Edit */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Edit</label>
              <select
                name="profileEdit"
                value={formData.profileEdit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Change Worklocation Pic */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Change Worklocation Pic</label>
              <select
                name="changeWorkLocation"
                value={formData.changeWorkLocation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
            type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Employee
            </button>
          </div>
        
      
      </form>
    </div>
  );
};

export default EmployeeAdd;
