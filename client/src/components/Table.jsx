// Table.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, Users, UserCheck, UserX } from "lucide-react";

const Table = ({
  data,
  columns,
  title,
  loading,
  error,
  emptyMessage = "No data found",
  emptyIcon = Users,
  rowPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 10,
  onRowClick,
  renderCell,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Pagination calculations
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

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

  if (loading) return <div className="text-center py-8">Loading data...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Error: {error}</div>;

  return (
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
              {rowPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
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
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={`px-4 py-3 text-${column.align || 'left'} text-xs font-Bold text-Black-500 uppercase tracking-wider ${column.width ? `w-${column.width}` : ''}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr 
                  key={item.id || index} 
                  className="hover:bg-gray-50 "
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className={`px-4 py-4 text-${column.align || 'left'}`}
                    >
                      {renderCell ? renderCell(column.key, item) : (
                        column.render ? column.render(item) : item[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center text-gray-500">
                    <emptyIcon size={48} className="mb-4 text-gray-300" />
                    <div className="text-sm">{emptyMessage}</div>
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
  );
};

export default Table;