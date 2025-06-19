import { useEffect, useState } from "react";

import Table from "../../components/Table";
import { SquarePen, Trash2, User } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { EMPLOYEE_ROUTE, HOST } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import AddButton from "../../components/AddButton";
import { toast } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch departments initially
    apiClient.get("/api/auth/department").then((res) => {
      setDepartments(res.data);
    });
  }, []);

  const handleAddEmployee = () => {
    navigate("/employee/add"); // Navigate to add department page
    // Or you can open a modal, show a form, etc.
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Fetch employees when department is selected
    if (field === "department" && value) {
      apiClient
        .get(`/api/auth/department/${value}/employees`)
        .then((response) => {
          setEmployees(response.data);
        });
    } else if (field === "department" && !value) {
      // Clear employees when no department selected
      setEmployees([]);
    }
  };
  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/api/auth/employee/${id}`);
      toast.success("Employee deleted successfully");

      // Update state to remove deleted employee
      setEmployees((prev) => prev.filter((emp) => emp.emp_id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  };

  const columns = [
    {
      key: "index",
      title: "ID",
      align: "left",
      render: (_dep, index) => <span className="text-xs">{index + 1}</span>,
    },

    {
      key: "name",
      title: "Name",
      align: "left",
      render: (emp) => {
        const imageUrl = emp.profile_img
          ? emp.profile_img.startsWith("http")
            ? emp.profile_img
            : `${HOST}/uploads/employees/${emp.profile_img}`
          : "/default-profile.png";

        return (
          <div className="flex items-center gap-2">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-12 h-12 rounded border object-cover"
              onError={(e) => (e.target.src = "")}
            />
            <div>
              <div className="font-semibold">
                {emp.name || `Employee ${emp.emp_id}`}
              </div>
              <div className="text-sm text-gray-500">
                {emp.username || `user${emp.emp_id}`}
              </div>
            </div>
          </div>
        );
      },
    },

    // {
    //   key: 'department_name',
    //   title: 'Department',
    //   align: 'left',
    //   render: (emp) => (
    //     emp.department_code || "Not Give Department")
    // },
    {
      key: "mobile_no",
      title: "Phone",
      align: "left",
      render: (emp) =>
        emp.mobile_no || `94${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
    {
      key: "designation_name",
      title: "Designation",
      align: "left",
      render: (emp) => emp.designation || "Not Given",
    },
    {
      key: "status",
      title: "Status",
      align: "center",
      render: () => (
        <span className="bg-green-500 text-white px-2 py-1 rounded-sm text-xs">
          Active
        </span>
      ),
    },
    {
      key: "Action",
      title: "Action",
      width: "w-16 md:w-32 lg:w-48",
      align: "left",
      render: (emp) => (
        <span className="flex gap-3">
          <Link
            to={`/employees/edit/${emp.emp_id}`}
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            title="View Employee Details"
          >
            <SquarePen size={15} />
          </Link>
          <Link
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            title="View Employee Details"
          >
            <Trash2
              size={15}
              onClick={() => handleDeleteEmployee(emp.emp_id)}
              className="cursor-pointer text-red-600"
            />
          </Link>
        </span>
      ),
    },
  ];

  const handleRowClick = (employee) => {
    console.log("Employee clicked:", employee);
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-sm md:text-xl font-bold text-blue-900 text-left mb-2">
          Departments Employee
        </h3>

        {/* Centered Department Selector */}
        <div className="flex justify-center mb-4 gap-4">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            {/* <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Department</label> */}
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
              value={filters.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option
                  key={dept.department_code || dept.department_name}
                  value={dept.department_code}
                >
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
          <AddButton onClick={handleAddEmployee} text="Add The Employee" />
        </div>

        {/* Table - Only show when department is selected */}
        {filters.department && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Table
              data={employees}
              columns={columns}
              title="Employees List"
              emptyMessage="No employees found in this department"
              emptyIcon={User}
              onRowClick={handleRowClick}
              rowPerPageOptions={[10, 20, 50]}
              defaultItemsPerPage={10}
              showSearch={true}
              showEntriesInfo={true}
            />
          </div>
        )}

        {/* Message when no department selected */}
        {!filters.department && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Please select a department to view employees
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
