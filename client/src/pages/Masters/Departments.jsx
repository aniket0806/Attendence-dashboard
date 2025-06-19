import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { User } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { DEPARTMENT_ROUTE } from "../../utils/constants";
import { SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AddButton from "../../components/AddButton";
import { toast } from "react-toastify";
const Departments = () => {
  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(DEPARTMENT_ROUTE);

        setDepartment(response.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, []);
  const handleAddDepartment = () => {
    navigate("/departments/add"); // Navigate to add department page
    // Or you can open a modal, show a form, etc.
  };



  const handleDeleteDepartment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (!confirmDelete) return;
  
    try {
      await apiClient.delete(`/api/auth/department/${id}`);
      toast.success("Department deleted successfully");
  
      // Update state to remove deleted Department
      setDepartment((prev) => prev.filter(dep => dep.id !== id));
    } catch (error) {
      console.error("Error deleting Department:", error);
      toast.error("Failed to delete Department");
    }
  };

  const columns = [
    {
      key: "index",
      title: "ID",
      align: "left",
      width: "w-16 md:w-32 lg:w-48",
      render: (_dep, index) => <span className="text-xs">{index + 1}</span>,
    },
    {
      key: "department_name",
      title: "Department Name",
      width: "w-16 md:w-32 lg:w-48",
      align: "left",
      render: (dep) => (
        <span className="text-xs uppercase">{dep.department_name}</span>
      ),
    },

    {
      key: "department_name_hindi",
      title: "Department_name_hindi",
      width: "w-16 md:w-32 lg:w-48",
      align: "left",
      render: (dep) => (
        <span className="text-xs"> {dep.department_name_hi || "-"}</span>
      ),
    },

    {
      key: "Status",
      title: "Status",
      width: "w-16 md:w-32 lg:w-48",
      align: "left",
      render: (dep) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            dep.status === 1
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {dep.status === 1 ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "Action",
      title: "Action",
      width: "w-16 md:w-32 lg:w-48",
      align: "left",

      render: (dep) => (
        <span className="flex gap-3">
          <Link
            to={`/departments/edit/${dep.id}`}
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            title="View Employee Details"
          >
            <SquarePen size={15} />
          </Link>
          <Link
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            title="View Employee Details"
          >
             <Trash2  size={15} 
            onClick={() => handleDeleteDepartment(dep.id)}
            className="cursor-pointer text-red-600"
            />
          </Link>
        </span>
      ),
    },
  ];

  return (
    <div className="p-1 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-blue-900">Department List</h3>
        {/* <div className="flex gap-2">
          <button className="bg-orange-500 text-white py-2 px-4 rounded flex items-center">
            <span className="mr-1">+</span> Add Employee
          </button>
          <button className="bg-white border border-gray-300 py-2 px-4 rounded flex items-center">
            <span>Export</span>
          </button>
        </div> */}

        <AddButton onClick={handleAddDepartment} text="Add The Department" />
      </div>

      <div className="bg-white rounded shadow ">
        <Table
          data={department}
          columns={columns}
          title="Department List"
          loading={loading}
          error={error}
          emptyMessage="No Department found"
          emptyIcon={User}
          rowPerPageOptions={[10, 20, 50]}
          defaultItemsPerPage={10}
          showSearch={true}
          showEntriesInfo={true}
        />
      </div>
    </div>
  );
};

export default Departments;
