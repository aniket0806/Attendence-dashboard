import  { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { DEPARTMENT_ROUTE, DESIGNATION_ROUTE, HOST, WORKLOCATION_ROUTE } from '../../../utils/constants';
import { apiClient } from '../../../lib/api-client';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const EmployeeEdit = () => {
  const [formData, setFormData] = useState({
    // Personal Info
    title: '',
    name: '',
    fullname_oth: '',
    mobile_no: '',
    email: '',
    
    // Login Info
    username: '',
    password: '',
    usertype: 'Employee',
    allow_eyeblink: 'No',

    
    // Work Info
    department_code: '',
    designation: '',
    ro: '',
    
    // Work Location
    selectedLocation: '',
    
    // Settings
    show_ad: 'No',
    profile_edit: 'No',
    work_shift: 'General : 09:30 am - 05:30 pm',
    check_fr: 'No',
    show_report: 'Yes',
    allow_edit: 'Yes',
    max_distance: '100',
    status: 'Active',
    profile_img: '',
    weekly_off: []
  });
  const { id } = useParams();
const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [workLocations, setWorkLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePictureFile, setProfilePictureFile] = useState('');
  const [existingImage,setExistingImage] =useState('')
  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, desigRes, locationRes] = await Promise.all([
           fetch(`${HOST}${DEPARTMENT_ROUTE}`),
        fetch(`${HOST}${DESIGNATION_ROUTE}`),
        fetch(`${HOST}${WORKLOCATION_ROUTE}`)
        ]);

        const [deptData, desigData, locationData] = await Promise.all([
          deptRes.json(),
          desigRes.json(),
          locationRes.json()
        ]);

        setDepartments(deptData);
        setDesignations(desigData);
        setWorkLocations(locationData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);



useEffect(() => {
  const fetchEmployee = async () => {
    try {
      const res = await apiClient.get(`/api/auth/employee/${id}`);
      const data = await res.data;
      const imageUrl = data.profile_img 
        ? data.profile_img.startsWith("http") 
          ? data.profile_img 
          : `${HOST}/uploads/employees/${data.profile_img}`
        : "";

      // Extract filename only for backend
      const filenameOnly = data.profile_img?.startsWith('http')
        ? data.profile_img.split('/').pop()
        : data.profile_img;

      setExistingImage(filenameOnly); 

      setFormData(prev => ({
        ...prev,
        ...data,
        weekly_off: data.weekly_off || [],
        id: data.id,
        profile_img: imageUrl,
      }));
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  if (id) fetchEmployee();
}, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWeeklyOffChange = (day) => {
    setFormData(prev => ({
      ...prev,
      weekly_off: prev.weekly_off.includes(day)
        ? prev.weekly_off.filter(d => d !== day)
        : [...prev.weekly_off, day]
    }));
  };
//   const handleFileChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     // Validate file type
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (!validTypes.includes(file.type)) {
//       alert('Only JPG, JPEG, and PNG files are allowed');
//       return;
//     }

//     // Validate file size (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('File size must be less than 5MB');
//       return;
//     }

//     setProfilePictureFile(file);
    
//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (profilePictureFile) {
//   formDataToSend.append('profile_img', profilePictureFile);
// }
//       setFormData(prev => ({
//         ...prev,
//         profile_img: e.target.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   }
// };

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    alert('Only JPG, JPEG, and PNG files are allowed');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  setProfilePictureFile(file); // Set only if user actually uploads

  //  Preview only for UI
  const reader = new FileReader();
  reader.onload = (e) => {
    setFormData(prev => ({
      ...prev,
      profile_img: e.target.result,
    }));
  };
  reader.readAsDataURL(file);
};



const resetProfilePicture = () => {
  setProfilePictureFile(null);
  setFormData(prev => ({
    ...prev,
    profile_img: ''
  }));
   setExistingImage('');
};
//  const handleSubmit = async () => {
//   try {
//     const formDataToSend = new FormData();
    
//     // Append all form data except weekly_off
//     for (const key in formData) {
//      if (key !== 'weekly_off' && key !== 'id' && key !== 'username') {
//   formDataToSend.append(key, formData[key]);
// }
//     }
    
//     // Append weekly_off as JSON string
//     formDataToSend.append('weekly_off', JSON.stringify(formData.weekly_off));
    
//     // Append the profile picture file if it exists
//     if (profilePictureFile) {
//       formDataToSend.append('profile_img', profilePictureFile);
//     }

//     const response = await fetch(`http://localhost:3008/api/auth/employee/${formData.id}`, {
//       method: 'PUT',
//       body: formDataToSend
//     });
    
//     if (response.ok) {
//       alert('Employee updated successfully!');
//     } else {
//       alert('Error updating employee');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     alert('Error updating employee');
//   }
// };
const handleSubmit = async () => {
  try {
    const normalizedData = {
      ...formData,
        show_ad: formData.show_ad === "Yes" ? "Y" : "N",
      profile_edit: formData.profile_edit ? "Y" : "N",
      allow_edit: formData.allow_edit === "Yes" ? "Y" : "N",
      check_fr: formData.check_fr === "Yes" ? "Y" : "N",
      status: formData.status === "Active" ? "A" : "I",
      show_report: formData.show_report === "Yes" ? "Y" : "N",
      allow_eyeblink: formData.allow_eyeblink === "Yes" ? "Y" : "N", //add this line
      weekly_off: formData.weekly_off.join(","), // Convert array to comma string
      // In your form submission normalization
work_shift:
  formData.work_shift === 'General : 09:30 am - 05:30 pm' ? 'G' : formData.work_shift,

    };
       // Remove 'id' and 'username' from being sent to the server
    delete normalizedData.id;
    delete normalizedData.username;

    const formToSend = new FormData();
    for (const key in normalizedData) {
      if (key !== "profile_img") {
        formToSend.append(key, normalizedData[key]);
      }
    }

    // Only include the new image file if uploaded
if (profilePictureFile) {
  formToSend.append("profile_img", profilePictureFile);
} else {
  // Send existing filename explicitly to retain image
  formToSend.append("existing_image", existingImage); 
}


    const response = await apiClient.put(
      `/api/auth/employee/${id}`,
      formToSend,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    toast.success("Employee updated successfully!");
    navigate("/masters/employees");
  } catch (error) {
    console.error("Error updating employee:", error);
    toast.error("Failed to update employee.");
  }
};

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="space-y-4">
        

        {/* Personal Info */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-purple-100 px-4 py-2 border-b">
            <h2 className="text-lg font-medium text-gray-700">Personal Info</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 gap-2 items-center">
              <label className="text-sm text-gray-600">Full Name In English</label>
              <select 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option>Shri.</option>
                <option>Smt.</option>
                <option>Ms.</option>
                <option>Dr.</option>
              </select>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600">Full Name In Hindi</label>
              <input
                type="text"
                name="fullname_oth"
                value={formData.fullname_oth}
                onChange={handleInputChange}
                placeholder=""
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
              <div></div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600">Contact No</label>
              <input
                type="text"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleInputChange}
                placeholder="mobile No"
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Login Info */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-purple-100 px-4 py-2 border-b">
            <h2 className="text-lg font-medium text-gray-700">Login Info</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600 ">Login Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                readOnly
                disabled
                placeholder="username"
                 className="col-span-2 border border-gray-300 bg-gray-100 rounded px-3 py-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600">Password</label>
              <div className="col-span-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="password"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600">Usertype</label>
              <select
                name="usertype"
                value={formData.usertype}
                onChange={handleInputChange}
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option>Employee</option>
                <option>Admin</option>
                <option>Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Info */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-purple-100 px-4 py-2 border-b">
            <h2 className="text-lg font-medium text-gray-700">Work Info</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600">Department</label>
              <select
                name="department_code"
                value={formData.department_code}
                onChange={handleInputChange}
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.department_code}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="">Select Designation</option>
                {designations.map(desig => (
                  <option key={desig.id} value={desig.designation}>
                    {desig.designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-gray-600 ">Current Reporting Officer</label>
              <select
                name="ro"
                value={formData.ro}
                onChange={handleInputChange}
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option></option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="text-sm text-red-600">Change Reporting Officer 
                


              </label>
              <select
                className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option>Select RO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Location */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-purple-100 px-4 py-2 border-b">
            <h2 className="text-lg font-medium text-gray-700">Work Location</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workLocations.map((location, index) => (
                <div key={location.id} className="text-center">
                  <div className="relative">
                    <img 
                      src={location.office_pic} 
                      alt={location.worklocation}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <div className="absolute top-2 right-2">
                      {index === 0 ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-gray-600">{location.worklocation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-purple-100 px-4 py-2 border-b">
            <h2 className="text-lg font-medium text-gray-700">Settings</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">Profile Edit</label>
                <select name="profile_edit" value={formData.profile_edit ? "Yes" : "No"} onChange={e => setFormData({ ...formData, profile_edit: e.target.value === "Yes" })}

                  className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">Change Worklocation Pic</label>
                <select
                  name="allow_edit"
                  value={formData.allow_edit}
                  onChange={handleInputChange}
                  className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">Working Shift</label>
                <select
                  name="work_shift"
                  value={formData.work_shift}
                  onChange={handleInputChange}
                  className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>General : 09:30 am - 05:30 pm</option>
                  <option>Morning : 06:00 am - 02:00 pm</option>
                  <option>Evening : 02:00 pm - 10:00 pm</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">Max Distance (in meter)</label>
                <input
                  type="number"
                  name="max_distance"
                  value={formData.max_distance}
                  onChange={handleInputChange}
                  className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">Real Time Face Check</label>
                <select
                  name="check_fr"
                  value={formData.check_fr}
                  onChange={handleInputChange}
                  className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">Show in Report</label>
                <select
                  name="show_report"
                  value={formData.show_report}
                  onChange={handleInputChange}
                  className="col-span-2 border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              {/* <div className="grid grid-cols-3 gap-2 items-start">
                <label className="text-sm text-gray-600">Profile Pic</label>
                <div className="col-span-2 flex items-center gap-2">
                  {formData.profile_img && (
                    <img 
                      src={formData.profile_img} 
                      alt="Profile" 
                      className="w-16 h-16 object-cover rounded border"
                    />
                  )}
                  <button
                    type="button"
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Reset Profile Pic
                  </button>
                </div>
              </div> */}
              <div className="grid grid-cols-3 gap-2 items-start">
  <label className="text-sm text-gray-600">Profile Pic</label>
  <div className="col-span-2 flex items-center gap-2">
    {formData.profile_img && (
      <img 
        src={formData.profile_img} 
        alt="Profile" 
        className="w-16 h-16 object-cover rounded border"
      />
    )}
    <div className="flex flex-col gap-2">
      <div>
        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleFileChange}
          className="hidden"
          id="profile-upload"
        />
        <label
          htmlFor="profile-upload"
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer"
        >
          {formData.profile_img ? 'Change' : 'Upload'}
        </label>
      </div>
      {formData.profile_img && (
        <button
          type="button"
          onClick={resetProfilePicture}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Reset
        </button>
      )}
    </div>
  </div>
</div>

            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-2">Weekly Holiday</label>
              <div className="flex flex-wrap gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.weekly_off.includes(day)}
                      onChange={() => handleWeeklyOffChange(day)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                Update Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEdit;