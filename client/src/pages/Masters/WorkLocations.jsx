import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { User} from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { WORKLOCATION_ROUTE } from "../../utils/constants";

const WorkLocations = () => {
  const [workLocations, setWorkLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchWorkLocations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(WORKLOCATION_ROUTE);
        setWorkLocations(response.data ||[]);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch WorkLocations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkLocations();
  }, []);

  const columns = [
    
    { 
      key: 'id', 
      title: 'ID', 
      align: 'left'
    },
{ 
      key: 'org_code', 
      title: 'Org Code', 
      align: 'left',
      render: (work) => ( 
        work.org_code || "Not Give code")
    },
// { 
//       key: 'wl_code', 
//       title: 'wl Code', 
//       align: 'left',
//       render: (work) => ( 
//         work.wl_code || "Not Give code")
//     },
{ 
      key: 'worklocation', 
      title: 'Work Location', 
      align: 'left',
      render: (work) => ( 
        work.worklocation || "Not Give code")
    },
    { 
      key: 'office_pic', 
      title: 'Image', 
      align: 'left',
      render: (work) => (
        <div className="flex items-center gap-2">
          <img
            src={work.office_pic}
            alt="Profile Image"
            className="w-12 h-12 rounded border object-cover"
            onError={(e) => e.target.src = '/default-profile.png'}
          />
          
        </div>
      )
    },
  
    { 
      key: 'latitude', 
      title: 'Latitude', 
      align: 'left',
      render: (work) => (
       work.latitude 
      )
    },
    { 
      key: 'longitude', 
      title: 'longitude', 
      align: 'left',
      render: (work) => (
        work.longitude || "Not Given"
      )
    },
    
  ];

  const handleRowClick = (employee) => {
    console.log('Employee clicked:', employee);
    // You can navigate to employee detail page here if needed
  };

  return (
    <div className="p-1 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-blue-900">Work Location</h3>
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
          data={workLocations}
          columns={columns}
          title="WorkLocations List"
          loading={loading}
          error={error}
          emptyMessage="No WorkLocations found"
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