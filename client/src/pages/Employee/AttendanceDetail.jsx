import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';

const AttendanceDetail = () => {
  const { username, date } = useParams();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('day'); // 'day', 'week', 'month'
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fullName, setFullName] = useState('');
  // Extract date from URL path
  const urlPath = window.location.pathname;
  const urlDateMatch = urlPath.match(/\/(\d{4}-\d{2}-\d{2})$/);
  const urlDate = urlDateMatch ? urlDateMatch[1] : null;
  
  // Use URL date or fallback to today
  const [selectedDate, setSelectedDate] = useState(urlDate || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Update selectedDate if URL changes
    if (urlDate) {
      setSelectedDate(urlDate);
    }
  }, [urlPath, urlDate]);

 useEffect(() => {
  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/auth/employee/attendance/${username}`);
      console.log("Attendance data:", res);
      setDetails(res.data.attendance || []);

      //  Set full name from the first attendance record
      if (res.data.attendance && res.data.attendance.length > 0) {
        setFullName(res.data.attendance[0].full_name || '');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [username]);


  // Filter data based on the selected filter and search term
  const getFilteredData = () => {
    let filteredData = [...details];
    
    // Apply date filter
    const currentDate = new Date(selectedDate);
    
    if (filterType === 'day') {
      // Filter for selected date only
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.mobile_date);
        // return itemDate.toISOString().split('T')[0] === selectedDate;
        return (
  itemDate.getFullYear() === currentDate.getFullYear() &&
  itemDate.getMonth() === currentDate.getMonth() &&
  itemDate.getDate() === currentDate.getDate()
);

      });
    } else if (filterType === 'week') {
      // Get the date 7 days before the selected date
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - 6);
      
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.mobile_date);
        return itemDate >= weekStart && itemDate <= currentDate;
      });
    } else if (filterType === 'month') {
      // Get the date 30 days before the selected date
      const monthStart = new Date(currentDate);
      monthStart.setDate(currentDate.getDate() - 29);
      
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.mobile_date);
        return itemDate >= monthStart && itemDate <= currentDate;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.activity_type.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        formatDate(item.mobile_date).toLowerCase().includes(searchLower)
      );
    }
    
    return filteredData;
  };

  // Format date for display in the table
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours ;
    
    return `${day} ${month} ${year}\n${formattedHours}:${minutes} ${ampm}`;
  };



  // Calculate pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Handle page change
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      
      <h4 className="text-xl font-bold flex  justify-center">{fullName} ({username})</h4>
      <div className="flex justify-between items-center mb-6">

        <h4 className="text-lg font-semibold ">Diary : 
         <span className='text-lg'> {formatDate(selectedDate).split('\n')[0]}</span>
        </h4>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span>Show </span>
          <select 
            className="border rounded px-2 py-1"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span> entries</span>
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded ${filterType === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterType('day')}
          >
            Day
          </button>
          <button 
            className={`px-3 py-1 rounded ${filterType === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterType('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 rounded ${filterType === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterType('month')}
          >
            Month
          </button>
        </div>
        {/* <div className="flex items-center">
          <span className="mr-2">Search: </span>
          <input 
            type="text" 
            className="border rounded px-2 py-1" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>
      
      {loading ? (
        <p>Loading attendance data...</p>
      ) : paginatedData.length === 0 ? (
        <p>No attendance record found for this date.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-3 text-left border">#</th>
                <th className="py-3 px-3 text-left border">DATE</th>
                <th className="py-3 px-3 text-left border">TYPE</th>
                <th className="py-3 px-3 text-left border">LOCATION</th>
                <th className="py-3 px-3 text-left border">IMAGE</th>
                <th className="py-3 px-3 text-left border">VER | MOBILE</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {paginatedData.map((item, index) => {
                const dateTime = formatDate(item.mobile_date && item.mobile_time).split('\n');
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 text-left border">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td className="py-2 px-2 text-left border">
                      <div>{dateTime[0]}</div>
                      <div>{dateTime[1]}</div>
                    </td>
                    <td className="py-2 px-2 text-left border">{item.activity_type === 'IN' ? 'CheckIn' : item.activity_type === 'OUT' ? 'CheckOut' : item.activity_type}</td>
                    <td className="py-2 px-2 text-left border">{item.location.split(', ').slice(0, 2).join(', ')}</td>
                    <td className="py-2 px-2 text-left border">
                      {item.attendance_image && (
                        <img 
                          src={item.attendance_image} 
                          alt="Attendance" 
                          className="w-16 h-16  rounded object-cover" 
                        />
                      )}
                    </td>
         <td className="py-2 px-2
          text-left border text-xs">
  {item.mobile_details?.split(',').map((part, index) => (
    <span key={index}>
      {part.trim()}
      {index < item.mobile_details.split(',').length - 1 && ' | '}
    </span>
  ))}
</td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <button 
          className="px-3 py-1 rounded bg-gray-200 mr-2"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i} 
            className={`px-3 py-1 rounded mx-1 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button 
          className="px-3 py-1 rounded bg-gray-200 ml-2"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        Showing {filteredData.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, filteredData.length)} of {filteredData.length} entries
      </div>
    </div>
  );
};

export default AttendanceDetail;