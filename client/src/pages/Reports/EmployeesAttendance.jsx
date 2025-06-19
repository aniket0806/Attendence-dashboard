import  { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { DEPARTMENT_ROUTE } from '../../utils/constants';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const EmployeeAttendance = () => {
  const [filters, setFilters] = useState({
    department: '',
    employee: '',
    fromDate: '',
    toDate: ''
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get(DEPARTMENT_ROUTE);
        setDepartments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch employees when department changes
  useEffect(() => {
    const fetchDepartmentsEmployees = async () => {
      try {
        if (filters.department) {
          const response = await apiClient.get(`/api/auth/employees?department=${filters.department}`);
          setEmployees(Array.isArray(response.data) ? response.data : []);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };
    fetchDepartmentsEmployees();
  }, [filters.department]);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (filters.employee && filters.fromDate && filters.toDate) {
      setLoading(true);
      try {
        const res = await apiClient.get(
          `/api/auth/attendance?employeeId=${filters.employee}&from=${filters.fromDate}&to=${filters.toDate}`
        );
        console.log("att", res)
        // setTableData(Array.isArray(res.data) ? res.data : []);

        if (Array.isArray(res.data)) {
  const grouped = {};

  res.data.forEach((record) => {
    const dateKey = new Date(record.mobile_date).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        checkIn: null,
        checkOut: null,
      };
    }

    const timeStr = new Date(record.mobile_time).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
    });

    if (record.activity_type === "IN") {
      if (!grouped[dateKey].checkIn || new Date(record.mobile_time) < new Date(grouped[dateKey].checkIn.raw)) {
        grouped[dateKey].checkIn = { raw: record.mobile_time, formatted: timeStr };
      }
    } else if (record.activity_type === "OUT") {
      if (!grouped[dateKey].checkOut || new Date(record.mobile_time) > new Date(grouped[dateKey].checkOut.raw)) {
        grouped[dateKey].checkOut = { raw: record.mobile_time, formatted: timeStr };
      }
    }
  });

  const finalData = Object.values(grouped).map(entry => ({
    date: entry.date,
    checkIn: entry.checkIn?.formatted || "-",
    checkOut: entry.checkOut?.formatted || "-"
  }));

  setTableData(finalData);
  setShowTable(true);}}
   catch (err) {
        console.error('Failed to fetch attendance report', err);
        setTableData([]);
        setShowTable(false);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill all filters');
    }
  };

 const handleExportToXLS = () => {
  if (tableData.length === 0) {
    alert("No data to export.");
    return;
  }

  // Define worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  // Create blob and trigger download
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  saveAs(data, "employee_attendance.xlsx");
};

  // Filter data based on search term
  const filteredData = tableData.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Employees Attendance</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Home className="w-4 h-4 mr-1" />
            <span className="mr-2">Home</span>
            <span className="mr-2">/</span>
            <span>Employees Attendance</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Filter Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.department_code || dept.department_name} value={dept.department_code}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.employee}
                onChange={(e) => handleInputChange('employee', e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={`${emp.username}-${emp.name}`} value={emp.username}>
                    {emp.name} [{emp.username}]
                  </option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
            <button
              onClick={handleExportToXLS}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export To XLS
            </button>
          </div>

          {/* Table */}
          {showTable && (
            <div className="mt-6">
              {/* Table Controls */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Show</span>
                  <select
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Search:</span>
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        CheckIn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                        CheckOut
                      </th>
                    
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length > 0 ? (
                      filteredData.slice(0, itemsPerPage).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                            {row.date || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                            {row.checkIn || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                            {row.checkOut|| '-'}
                          </td>
                         
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          No attendance data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Info */}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-700">
                <div>
                  Showing {Math.min(itemsPerPage, filteredData.length)} of {filteredData.length} entries
                  {searchTerm && ` (filtered from ${tableData.length} total entries)`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;