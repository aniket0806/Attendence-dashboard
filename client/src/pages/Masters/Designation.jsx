import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { User} from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { DESIGNATION_ROUTE } from "../../utils/constants";

const Designation = () => {
  const [designation, setDesignation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(DESIGNATION_ROUTE);
        setDesignation(response.data ||[]);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignation();
  }, []);

  const columns = [
    
    { 
      key: 'id', 
      title: 'ID', 
      align: 'left',
      render: (des) => (
        des.id || "-"
      )
    },
    { 
      key: 'designation', 
      title: 'Designation', 
      align: 'left',
    render: (des) => ( 
        des.designation || "-")
    },
    
    { 
      key: 'designation_other', 
      title: 'Designation_Other', 
      align: 'left',
    render: (des) => ( 
        des.designation_other || "-")
    },
    
    { 
      key: 'designation_code', 
      title: 'Designation_code', 
      align: 'left',
      render: (des) => ( 
        des.designation_code|| "-")
    },
    { 
      key: 'short_code', 
      title: 'short_code', 
      align: 'left',
      render: (des) => (
        des.short_code || "-"
      )
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