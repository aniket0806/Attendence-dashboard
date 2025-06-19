import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, User } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { HOST, WORKLOCATION_ROUTE } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import AddButton from "../../components/AddButton";
import { toast } from "react-toastify";

const WorkLocations = () => {
  const [workLocations, setWorkLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkLocations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(WORKLOCATION_ROUTE);
        setWorkLocations(response.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch WorkLocations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkLocations();
  }, []);

  const handleAddWorkLocation = () => {
    navigate("/worklocation/add");
  };

  const handleDeleteWorklocation = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this work location?");
    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/api/auth/worklocation/${id}`);
      toast.success("Work location deleted successfully");

      setWorkLocations((prev) => prev.filter((wl) => wl.id !== id));
    } catch (error) {
      console.error("Error deleting work location:", error);
      toast.error("Failed to delete work location");
    }
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      align: 'left',
    },
    {
      key: 'org_code',
      title: 'Org Code',
      align: 'left',
      render: (work) => work.org_code || "Not Given",
    },
    {
      key: 'worklocation',
      title: 'Work Location',
      align: 'left',
      render: (work) => work.worklocation || "Not Given",
    },
    {
      key: 'office_pic',
      title: 'Image',
      align: 'left',
      render: (work) => (
        <div className="flex items-center gap-2">
        
          <img
            src={work.office_pic ? (work.office_pic.startsWith('http') ? work.office_pic : `${HOST}/uploads/worklocation/${work.office_pic}`) : '/default-profile.png'}
            alt="Office"
            className="w-12 h-12 rounded border object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-profile.png';
            }}
          
            />
            </div>
      ),
    },
    {
      key: 'latitude',
      title: 'Latitude',
      align: 'left',
      render: (work) => work.latitude || "-",
    },
    {
      key: 'longitude',
      title: 'Longitude',
      align: 'left',
      render: (work) => work.longitude || "Not Given",
    },
    {
      key: 'Action',
      title: 'Action',
      width: 'w-16 md:w-32 lg:w-48',
      align: 'left',
      render: (dep) => (
        <span className="flex gap-3">
          <Link
            to={`/worklocation/edit/${dep.id}`}
            className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            title="Edit Work Location"
          >
            <SquarePen size={15} />
          </Link>
          <button
            onClick={() => handleDeleteWorklocation(dep.id)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
            title="Delete Work Location"
          >
            <Trash2 size={15} />
          </button>
        </span>
      ),
    },
  ];

  const handleRowClick = (workLocation) => {
    console.log("Work Location clicked:", workLocation);
  };

  return (
    <div className="p-1 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-blue-900">Work Location</h3>
        <AddButton onClick={handleAddWorkLocation} text="Add The WorkLocation" />
      </div>

      <div className="bg-white rounded shadow">
        <Table
          data={workLocations}
          columns={columns}
          title="Work Locations List"
          loading={loading}
          error={error}
          emptyMessage="No Work Locations found"
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

export default WorkLocations;
