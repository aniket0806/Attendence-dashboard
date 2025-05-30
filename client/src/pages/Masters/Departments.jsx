import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { User} from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { DEPARTMENT_ROUTE } from "../../utils/constants";

const Departments = () => {
  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(DEPARTMENT_ROUTE);
        setDepartment(response.data ||[]);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, []);

  const columns = [
    
    { 
      key: 'id', 
      title: 'ID', 
      align: 'left',
       width: 'w-16 md:w-32 lg:w-48',
     
      render: (dep) => (
        <span className="text-xs">  {dep.id || "-"}</span>
      
      )
    },
    { 
      key: 'department_name', 
      title: 'Department Name', 
       width: 'w-16 md:w-32 lg:w-48',
      align: 'left',
    render: (dep) => ( 
         <span className="text-xs">{dep.department_name}</span>
      
      )
    },
    
    { 
      key: 'department_code', 
      title: 'Department_code',
       width: 'w-16 md:w-32 lg:w-48', 
      align: 'left',
    render: (dep) => ( 
       <span className="text-xs">  { dep.Department_code || "-"}</span>

       )
    },
    
    { 
      key: 'total_employees', 
      title: 'Total Employees', 
       width: 'w-16 md:w-32 lg:w-48',
      align: 'left',
     
      render: (dep) => ( 
        <span className="text-xs">  { dep.total_employees || "-"}
        </span>)
    },
   ];



  return (
    <div className="p-1 bg-white">
      <div clas3sName="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-blue-900">Department List</h3>
        {/* <div className="flex gap-2">
          <button className="bg-orange-500 text-white py-2 px-4 rounded flex items-center">
            <span className="mr-1">+</span> Add Employee
          </button>
          <button className="bg-white border border-gray-300 py-2 px-4 rounded flex items-center">
            <span>Export</span>
          </button>
        </div> */}
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