import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-client";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import AttendanceCalender from "./AttendanceCalendar";
const EmployeeDashboard = () => {
  const { username } = useParams(); // get `username` from route parameter
  const [employee, setEmployee] = useState(null); // store fetched employee data
  
  // Attendance data for the pie chart
  const attendanceData = [
    { name: "On time", value: 1254, color: "#1e3a5f" },
    { name: "Late Attendance", value: 32, color: "#2ecc71" },
    { name: "Work From Home", value: 658, color: "#e74c3c" },
    { name: "Absent", value: 14, color: "#e74c3c" },
    { name: "Sick Leave", value: 68, color: "#f1c40f" }
  ];
  
  const COLORS = attendanceData.map(item => item.color);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await apiClient.get(`/api/auth/employeedashboard/${username}`);
        setEmployee(response.data); // update state with fetched data
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployee();
  }, [username]);

  if (!employee) {
    return <div>Loading...</div>; // or a spinner
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-1">Employee Dashboard</h2>
        <nav className="flex">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-500">Dashboard</li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700">Employee Dashboard</li>
          </ol>
        </nav>
      </div>

    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-800 p-3 relative">
            <div className="flex items-center">
              <div className="h-20 w-15 rounded border-2 border-white mr-3 overflow-hidden flex-shrink-0">
                <img
                  src={employee.profile_img || "NA" }
                  alt="Employee"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="gap-5">
                <h2 className="text-white text-md font-medium">{employee.title} {employee.name}</h2>
              <p className="text-white  text-sm">Employee ID - {employee.username}</p>
              
              <p className="text-white text-sm">Department-{employee.department_code}</p>
              </div>
              <div className="text-right mr-10">
                <p className="text-white text-md text-sm ">Designation- {employee.designation}</p>
              <p className="text-white  text-sm">Phone Number - {employee.mobile_no}</p>
              
              <p className="text-balance  text-white text-sm">Location-{employee.location}</p>
              </div>
            </div>
            {/* <button className="absolute top-4 right-4 bg-gray-700 p-1 rounded-full text-white hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button> */}
          </div>

          
        </div>
    </div>


      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       Employee Info Card 
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-800 p-3 relative">
            <div className="flex items-center">
              <div className="h-20 w-15 rounded border-2 border-white mr-3 overflow-hidden flex-shrink-0">
                <img
                  src={employee.profile_img || "NA" }
                  alt="Employee"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white text-md font-medium">{employee.title} {employee.name}</h3>
              </div>
            </div>
            <button className="absolute top-4 right-4 bg-gray-700 p-1 rounded-full text-white hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>

          <div className="p-3">
             
            <div className="mb-2">
              <span className="text-sm text-gray-500 block mb-1">Employee ID</span>
              <p className="text-gray-800">{employee.title}{employee.username}</p>
            </div>
            <div className="mb-2">
              <span className="text-sm text-gray-500 block mb-1">Department</span>
              <p className="text-gray-800">{employee.department_code}</p>
            </div>
            
            <div className="mb-2">
              <span className="text-sm text-gray-500 block mb-1">Designation</span>
              <p className="text-gray-800">{employee.designation}</p>
            </div>
            
            <div className="mb-2">
              <span className="text-sm text-gray-500 block mb-1">Phone Number</span>
              <p className="text-gray-800">{employee.mobile_no}</p>
            </div>
           
            
            <div className="mb-2">
              <span className="text-sm text-gray-500 block mb-1">Location</span>
              <p className="text-gray-800">{employee.location}</p>
            </div>
          </div>
        </div>

        Attendance Chart Card
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Leave Details</h3>
            <span className="bg-gray-100 px-3 py-1 rounded text-gray-700">2024</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center">
              <span className="h-3 w-3 bg-blue-900 rounded-full mr-2"></span>
              <span className="text-gray-700">1254 on time</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-700">32 Late Attendance</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 bg-orange-500 rounded-full mr-2"></span>
              <span className="text-gray-700">658 Work From Home</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-gray-700">14 Absent</span>
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 bg-yellow-400 rounded-full mr-2"></span>
              <span className="text-gray-700">68 Sick Leave</span>
            </div>
          </div>
          
          
        </div>

        Leave Details Card
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Leave Details</h3>
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-1 rounded text-gray-700">2024</span>
              <button className="ml-2 bg-orange-500 p-2 rounded text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v7l5 5"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <span className="text-gray-500 text-sm">Total Leaves</span>
              <p className="text-2xl font-semibold">16</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Taken</span>
              <p className="text-2xl font-semibold">10</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Absent</span>
              <p className="text-2xl font-semibold">2</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Request</span>
              <p className="text-2xl font-semibold">0</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Worked Days</span>
              <p className="text-2xl font-semibold">240</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Loss of Pay</span>
              <p className="text-2xl font-semibold">2</p>
            </div>
          </div>
          
          <button className="w-full bg-gray-800 text-white py-3 rounded mt-8 hover:bg-gray-700 transition-colors">
            Apply New Leave
          </button>
        </div>
      </div> */}
     {employee && <AttendanceCalender employeeData={employee.attendance || []} />}
    </div>
  );
};

export default EmployeeDashboard;