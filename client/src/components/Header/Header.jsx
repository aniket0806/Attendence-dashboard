// Header.jsx
import { Search, Grid3x3, Settings, ChevronLeft, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/api-client";
import  ProfileDropdown  from "../ProfileDropdown";
import { useSelector } from "react-redux";


export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
const user = useSelector((state) => state.auth.user);
const isAdmin = user?.usertype === 'A';

  // Fetch employee suggestions
  const fetchEmployeeSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(`api/auth/search?q=${encodeURIComponent(query)}`);
      const data = await response.data
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching employee suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchEmployeeSuggestions(value);
  };

  // Handle employee selection
  const handleEmployeeSelect = (employee) => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/employeedashboard/${employee.username}`);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white border-b border-gray-200 px-3 py-1.5 h-12">
      <div className="flex items-center justify-between w-full">
        {/* Left section - Back arrow and Search */}
        <div className="flex items-center gap-3">
          {/* Back arrow with toggle functionality */}
          <button 
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <ChevronLeft 
              className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${
                isSidebarOpen ? 'rotate-0' : 'rotate-180'
              }`} 
            />
          </button>
         
          {/* Search section - Only for Admins */}
          {isAdmin && (
            <div className="flex items-center max-w-xs" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-6 pr-8 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded"
                  >
                    <X className="w-2.5 h-2.5 text-gray-400" />
                  </button>
                )}

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="p-3 text-xs text-gray-500 text-center">Searching...</div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((employee) => (
                        <div
                          key={employee.emp_id}
                          onClick={() => handleEmployeeSelect(employee)}
                          className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            {employee.profile_img ? (
                              <img
                                src={employee.profile_img}
                                alt={employee.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-500" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-900">{employee.name}</div>
                              <div className="text-xs text-gray-500">@{employee.username} • {employee.designation}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-gray-500 text-center">No employees found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right section - Profile Dropdown */}
        <div className="flex items-center">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}