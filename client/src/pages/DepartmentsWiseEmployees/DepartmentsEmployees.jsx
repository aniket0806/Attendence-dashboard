// DepartmentDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, Home, Users, UserCheck, UserX } from "lucide-react";
import { apiClient } from "../../lib/api-client";

const DepartmentsEmpoyees = () => {
  const { departmentCode } = useParams();

  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [selectedDate, setSelectedDate] = useState(date);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
useEffect(() => {
  const fetchDepartmentEmployees = async () => {
    try {
      const encodedDept = encodeURIComponent(departmentCode);
      const response = await apiClient.get(`/api/auth/departmentsemployees?departmentCode=${encodedDept}`);
      console.log("Fetched department employees:", response.data);
      const sortedEmployees = (response.data || []).sort((a, b) => {
        const aIsPresent = a.checkin_image !== null || a.checkout_image !== null;
        const bIsPresent = b.checkin_image !== null || b.checkout_image !== null;

        if (aIsPresent && !bIsPresent) return -1;
        if (!aIsPresent && bIsPresent) return 1;
        return 0;
      });

      setEmployees(sortedEmployees);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching department employees:', err);
    } finally {
      setLoading(false);
    }
  };

  if (departmentCode) {
    fetchDepartmentEmployees();
  }
}, [departmentCode]);





  // Pagination calculations
  const totalItems = employees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) return <div className="text-center py-8">Loading department data...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Error: {error}</div>;

  return (
    <div className="p-2">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Department: {departmentCode}</h2>
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="flex items-center hover:text-blue-600">
            <Home size={16} className="mr-1" />
          </Link>
          <span>/</span>
          <Link to="/" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-500">Department Detail</span>
        </nav>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Row Page:</span>
              <select 
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600 ml-2">
                {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-bold text-black-500 uppercase tracking-wider w-16 ">ID</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-black-500 uppercase tracking-wider w-24">Profile</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider w-24">Employee Details</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-black-500 uppercase tracking-wider w-28">Check In</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-black-500 uppercase tracking-wider w-28">Check Out</th>
                {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th> */}
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee, index) => (
                  <tr key={employee.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm text-gray-900">
                       {startIndex + index + 1}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <img 
                          src={employee.profile_img} 
                          className="w-24 h-28 rounded border object-cover" 
                          alt="Profile"
                          onError={(e) => e.target.src = '/default-profile.png'}
                        />
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">{employee.username}</div>
                        <div className="text-xs text-blue-600">{employee.designation}</div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      {employee.checkin_image ? (
                        <div className="flex flex-col items-center space-y-1">
                          {/* <div className="text-xs font-medium text-green-600">
                            {new Date(employee.check_in_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div> */}
                          <img 
                            src={employee.checkin_image} 
                            className="w-24 h-28  border object-cover shadow-sm" 
                            alt="check-in"
                            title="Check-in Image"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          -
                        </span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      {employee.checkout_image ? (
                        <div className="flex flex-col items-center space-y-1">
                          {/* <div className="text-xs font-medium text-orange-600">
                            {new Date(employee.check_out_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div> */}
                          <img 
                            src={employee.checkout_image} 
                            className="w-24 h-24 rounded border object-cover shadow-sm" 
                            alt="check-out"
                            title="Check-out Image"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        -
                        </span>
                      )}
                    </td>
                    
                    {/* <td className="px-4 py-4 text-center">
                      {employee.checkin_image ? (
                       employee.checkout_image ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <UserCheck size={12} className="mr-1" />
                            Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Users size={12} className="mr-1" />
                            In Office
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <UserX size={12} className="mr-1" />
                          Absent
                        </span>
                      )}
                    </td> */}
                    
                    <td className="px-4 py-4 text-center">
                      <Link 
                        to={`/employeedashboard/${employee.username}`} 
                        className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                        title="View Employee Details"
                      >
                        <Calendar size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center text-gray-500">
                      <Users size={48} className="mb-4 text-gray-300" />
                      <div className="text-sm">No employees found in this department</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({totalItems} total entries)
              </div>
              <nav className="flex items-center space-x-1">
                {/* Previous Button */}
                <button 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page Numbers */}
                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page} 
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))
                ) : (
                  getPaginationNumbers().map((page, index) => (
                    <button 
                      key={index} 
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white' 
                          : page === '...' 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }`}
                      onClick={() => page !== '...' && handlePageChange(page)}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))
                )}
                
                {/* Next Button */}
                <button 
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        )}
        
       
     
      </div>
    </div>
  );
};

export default DepartmentsEmpoyees;