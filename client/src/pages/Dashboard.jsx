import { useEffect, useState } from 'react'
import { apiClient } from '../lib/api-client'
import { useNavigate } from 'react-router-dom'
import { Building, CalendarClock, LogOut, Clock, BarChart, Users } from 'lucide-react'
import { DASHBOARD_ROUTE } from '../utils/constants'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get(DASHBOARD_ROUTE)
        setDashboardData(response.data)
        console.log("Fetched dashboard data:", response.data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <div className="flex justify-center items-center py-5">Loading dashboard...</div>
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Error: {error}</div>

  // Calculate summary stats
  const logs = dashboardData?.logs || []
  const today = new Date().toISOString().split('T')[0];
 const totalCheckins = dashboardData?.employeeAttendance?.filter(entry => {
  if (!entry.check_in_time) return false;
  const entryDate = new Date(entry.check_in_time).toISOString().split('T')[0];
  return entryDate === today;
}).length || 0;
const totalCheckouts = dashboardData?.employeeAttendance?.filter(entry => {
  if (!entry.check_out_time) return false;
  const entryDate = new Date(entry.check_out_time).toISOString().split('T')[0];
  return entryDate === today;
}).length || 0;

  const outOfOffice = (dashboardData?.employeeAttendance?.filter(e => {
  if (!e.check_out_time) return false;
  const entryDate = new Date(e.check_out_time).toISOString().split('T')[0];
  return entryDate === today;
}).length || 0);
  const lateReporting = (dashboardData?.employeeAttendance?.filter(e => {
  if (!e.check_in_time) return false;
  const checkInHour = new Date(e.check_in_time).getHours();
  return checkInHour > 10;
}).length || 0);

  // Extract department data from the API response
  let departmentData = []
  
  // First check if we have direct department data
  if (Array.isArray(dashboardData?.deptSummary)) {
    departmentData = dashboardData.deptSummary
  } 
  // Next check if it's provided as numeric keys in the root
  else if (dashboardData && typeof dashboardData === 'object') {
    const numericKeys = Object.keys(dashboardData).filter(key => !isNaN(key) && 
      dashboardData[key]?.total_employees !== undefined)
    
    if (numericKeys.length > 0) {
      departmentData = numericKeys.map(key => dashboardData[key])
    }
    // If we still don't have department data, try to extract it from employee data
    else if (Array.isArray(dashboardData.employeeAttendance)) {
      // Group employees by department code
      const deptMap = new Map()
      
      dashboardData.employeeAttendance.forEach(employee => {
        if (employee.department_code) {
          // If department exists, add to employee count
          if (deptMap.has(employee.department_code)) {
            const dept = deptMap.get(employee.department_code)
            dept.total_employees++
            if (employee.attendance_status === 'Present') {
              dept.present_count++
            }
          } 
          // Otherwise create new department entry
          else {
            deptMap.set(employee.department_code, {
              department_code: employee.department_code,
              total_employees: 1,
              present_count: employee.attendance_status === 'Present' ? 1 : 0,
              attendance_percentage: '0.00' // Will calculate later
            })
          }
        }
      })
      
      // Calculate percentages and format the final department data
      departmentData = Array.from(deptMap.values()).map(dept => {
        const percentage = dept.total_employees > 0 
          ? (dept.present_count / dept.total_employees * 100).toFixed(2)
          : '0.00'
        
        return {
          ...dept,
          attendance_percentage: percentage
        }
      })
    }
  }
  
  // Sort by department code
  departmentData.sort((a, b) => a.department_code.localeCompare(b.department_code))
  
  // Sample chart data for the bar chart
  const chartData = [
    { name: 'UI/UX', employees: 95 },
    { name: 'Development', employees: 110 },
    { name: 'Management', employees: 60 },
    { name: 'HR', employees: 25 },
    { name: 'Testing', employees: 75 },
    { name: 'Marketing', employees: 85 }
  ]

  const maxEmployees = Math.max(...chartData.map(d => d.employees))

  const handleDepartmentClick = (departmentCode) => {
    if (!departmentCode) return;
    const today = new Date().toISOString().split('T')[0];
    navigate(`/department/${encodeURIComponent(departmentCode)}?date=${today}`);
  }
  
  // Use sample data if no department data is available
  const displayDepartments = departmentData.length > 0 ? departmentData : [];

  return (
    <div className="p-6 bg-gray-50 min-h-fit">
 {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Total Checkin Today */}
        <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <Building className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
              {totalCheckins}</span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">Total Checkin Today</span>
              </div>
            </div>
          </div>
        </div>


        {/* Out of Office Now */}
         <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <CalendarClock className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
             {outOfOffice}</span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">Out of Office Now </span>
              </div>
            </div>
          </div>
        </div>


    

        {/* Total Checkout Today */}

 <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
              {totalCheckouts}</span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">Total Checkout Today</span>
              </div>
            </div>
          </div>
        </div>
   {/* Late Reporting */}

    <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
              {lateReporting}</span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">Late Reporting</span>
              </div>
            </div>
          </div>
        </div>






       
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department Cards - Takes 2 columns */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold mb-3">Department-wise Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {displayDepartments.map((dept, index) => {
              // Ensure we have valid numbers
              const totalEmployees = Number(dept.total_employees) || 0;
              const presentCount = Number(dept.present_count) || 0;
              const outCount = Number(dept.out_count) || 0;
              
              // Calculate percentage safely
              const percentage = totalEmployees > 0 
                ? Math.round((presentCount / totalEmployees) * 100)
                : 0;

              // Determine card color
              let bgColor = 'bg-gray-500'; // Default for no employees
              if (totalEmployees > 0) {
                bgColor = percentage >= 80 ? 'bg-green-700' :
                          percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
              }

              return (
                <div 
                  key={`dept-${index}`}
                  className={`${bgColor} rounded-md shadow text-white p-1.5 text-center cursor-pointer transform transition-transform duration-300 hover:scale-105`}
                  onClick={() => dept.department_code  &&  handleDepartmentClick(dept.department_code)}
                >
                  
                  <div className="text-sm font-semibold mb-1 border-b truncate">{dept.department_code || "Unassigned"}
                      <div className="text-xs font-semibold text-gray-200">
                        {totalEmployees}       </div>
                  </div>

                  <div className="text-xs font-bold">
                    IN: {presentCount}  | OUT: {outCount}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Bar Chart Section - Takes 1 column */}
        {/* <div className="bg-white p-4 rounded-md shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Employees By Department</h2>
            <div className="bg-white border border-gray-300 rounded px-2 py-1 text-xs">
              This Week
            </div>
          </div>
          
          <div className="space-y-3">
            {chartData.map((dept, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-14 text-xs font-medium text-gray-700">
                  {dept.name}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                  <div 
                    className="bg-orange-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(dept.employees / maxEmployees) * 100}%` }}
                  ></div>
                </div>
                <div className="w-6 text-xs font-medium text-gray-700">
                  {dept.employees}
                </div>
              </div>
            ))}
          </div>

          Chart Footer
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">
                No of Employees increased by <span className="text-green-600 font-semibold">+20%</span> from last Week
              </span>
            </div>
          </div>

          Scale indicators
          <div className="mt-3 flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
            <span>120</span>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Dashboard