import { useEffect, useState } from "react";

import Table from "../../components/Table";
import { User} from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { EMPLOYEE_ROUTE } from "../../utils/constants";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(EMPLOYEE_ROUTE);
        setEmployees(response.data ||[]);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    
    { 
      key: 'emp_id', 
      title: 'Emp ID', 
      align: 'left'
    },
    { 
      key: 'name', 
      title: 'Name', 
      align: 'left',
      render: (emp) => (
        <div className="flex items-center gap-2">
          <img
            src={emp.profile_img}
            alt="Profile Image"
            className="w-12 h-12 rounded border object-cover"
            onError={(e) => e.target.src = '/default-profile.png'}
          />
          <div>
            <div className="font-semibold">{emp.name || `Employee ${emp.emp_id}`}</div>
            <div className="text-sm text-gray-500">{emp.username || `user${emp.emp_id}`}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'department_name', 
      title: 'Department', 
      align: 'left',
      render: (emp) => ( 
        emp.department_code || "Not Give Department")
    },
    { 
      key: 'mobile_no', 
      title: 'Phone', 
      align: 'left',
      render: (emp) => (
        emp.mobile_no || `94${Math.floor(10000000 + Math.random() * 90000000)}`
      )
    },
    { 
      key: 'designation_name', 
      title: 'Designation', 
      align: 'left',
      render: (emp) => (
        emp.designation || "Not Given"
      )
    },
    { 
      key: 'status', 
      title: 'Status', 
      align: 'center',
      render: () => (
        <span className="bg-green-500 text-white px-2 py-1 rounded-sm text-xs">Active</span>
      )
    }
  ];

  const handleRowClick = (employee) => {
    console.log('Employee clicked:', employee);
    // You can navigate to employee detail page here if needed
  };

  return (
    <div className="p-1 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-blue-900">Departments Employee</h3>
        {/* <div className="flex gap-2">
          <button className="bg-orange-500 text-white py-2 px-4 rounded flex items-center">
            <span className="mr-1">+</span> Add Employee
          </button>
          <button className="bg-white border border-gray-300 py-2 px-4 rounded flex items-center">
            <span>Export</span>
          </button>
        </div> */}
      </div>

      <div className="bg-white rounded shadow">
        

        <Table
          data={employees}
          columns={columns}
          title="Employees List"
          loading={loading}
          error={error}
          emptyMessage="No employees found"
          emptyIcon={User}
          onRowClick={handleRowClick}
          rowPerPageOptions={[10, 20, 50]}
          defaultItemsPerPage={10}
          showSearch={true}
          showEntriesInfo={true}
        />
      </div>
    </div>
  );
};

export default Employees;