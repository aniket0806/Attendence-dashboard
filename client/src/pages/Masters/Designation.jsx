import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { User } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { DESIGNATION_ROUTE } from "../../utils/constants";
import { SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AddButton from "../../components/AddButton";
import { toast } from "react-toastify";
const Designation = () => {
  const [designation, setDesignation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(DESIGNATION_ROUTE);
        console.log(response);
        console.log("des", response);
        setDesignation(response.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignation();
  }, []);
 const handleAddDesignation = () => {
    navigate("/designation/add"); // Navigate to add department page
    // Or you can open a modal, show a form, etc.
  };

   const handleDeleteDesignation = async (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this Designation?");
      if (!confirmDelete) return;
    
      try {
        await apiClient.delete(`/api/auth/designation/${id}`);
        toast.success("Designation deleted successfully");
    
        // Update state to remove deleted Department
        setDesignation((prev) => prev.filter(des => des.id !== id));
      } catch (error) {
        console.error("Error deleting Designation:", error);
        toast.error("Failed to delete Designation");
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
      key: "designation",
      title: "Designation",
      align: "left",
      render: (des) => des.designation || "-",
    },

    {
      key: "designation_other",
      title: "Designation_Other",
      align: "left",
      render: (des) => des.designation_other || "-",
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
            to={`/designations/edit/${dep.id}`}
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
            onClick={() => handleDeleteDesignation(dep.id)}
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
        <h3 className="text-sm font-bold text-blue-900">Designation</h3>
        {/* <div className="flex gap-2">
          <button className="bg-orange-500 text-white py-2 px-4 rounded flex items-center">
            <span className="mr-1">+</span> Add Employee
          </button>
          <button className="bg-white border border-gray-300 py-2 px-4 rounded flex items-center">
            <span>Export</span>
          </button>
        </div> */}

        <AddButton onClick={handleAddDesignation} text="Add The Designation" />
        
      </div>

      <div className="bg-white rounded shadow">
        <Table
          data={designation}
          columns={columns}
          title="Designation List"
          loading={loading}
          error={error}
          emptyMessage="No designation found"
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

export default Designation;
