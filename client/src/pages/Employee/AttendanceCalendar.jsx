import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AttendanceCalendar = ({ employeeData }) => {
  const { username } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', or 'day'
  const [attendanceData, setAttendanceData] = useState({});
  const navigate = useNavigate();

  const handleDateClick = (date) => {
  const dateKey = formatDateKey(date);
  const record = attendanceData[dateKey];

  // Only allow navigation if there's an IN or OUT record
  if (record && (record.in || record.out)) {
    navigate(`/employee/${username}/attendance-detail/${dateKey}`);
  }
};


  // Helper functions for date manipulation
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  const getYear = (date) => {
    return date.getFullYear();
  };
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Helper to format date key
  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Format time from ISO string
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return null;
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Process attendance data from API response
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await apiClient.get(`/api/auth/employeedashboard/${username}`);
      console.log("Attendance Data Response:", response.data);
        
        // Create a formatted attendance data object
        const formattedData = {};
        
        // Check if attendance array exists in the response
        if (response.data && Array.isArray(response.data.attendance)) {
          // Process each attendance record
          response.data.attendance.forEach(record => {
            // Convert mobile_date to a date object
            const recordDate = new Date(record.mobile_date);
            // Format the date as YYYY-MM-DD
            const dateKey = formatDateKey(recordDate);
            
            // Initialize the entry if it doesn't exist
            if (!formattedData[dateKey]) {
              formattedData[dateKey] = {};
            }
            
            // Set in/out times based on activity_type
            if (record.activity_type === 'IN') {
              formattedData[dateKey].in = formatTime(record.mobile_time);
            } else if (record.activity_type === 'OUT') {
              formattedData[dateKey].out = formatTime(record.mobile_time);
            }
          });
        }
        
        // Add today's check-in if available from employeeData
        const today = new Date();
        const todayKey = formatDateKey(today);
        
        let checkInTimeString = "";
        if (employeeData && employeeData.check_in_time) {
          checkInTimeString = formatTime(employeeData.check_in_time);
          
          // Only add if today's data doesn't already exist or doesn't have check-in
          if (!formattedData[todayKey] || !formattedData[todayKey].in) {
            if (!formattedData[todayKey]) {
              formattedData[todayKey] = {};
            }
            formattedData[todayKey].in = checkInTimeString;
          }
        }
        
        console.log("Formatted Attendance Data:", formattedData);
        setAttendanceData(formattedData);
        
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [username, employeeData]);
 
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const goToNext = () => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar data generation based on view mode
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Get attendance for a specific date
  const getAttendanceForDate = (date) => {
    const dateKey = formatDateKey(date);
    return attendanceData[dateKey];
  };
  
  // Functions for different view modes
  const getMonthView = () => {
    const days = [];
    const prevMonthDays = getDaysInMonth(year, month - 1);
    
    // Previous month's days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const date = new Date(year, month - 1, prevMonthDays - firstDayOfMonth + i + 1);
      days.push({
        day: date.getDate(),
        isCurrentMonth: false,
        date: date
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date: date
      });
    }
    
    // Next month's days to fill the remaining cells
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        day: i,
        isCurrentMonth: false,
        date: date
      });
    }
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };
  
  const getWeekView = () => {
    const days = [];
    const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Calculate the first day of the week (Sunday)
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDay);
    
    // Get the 7 days of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      
      days.push({
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        date: date
      });
    }
    
    return [days]; // Return as a single week
  };
  
  const getDayView = () => {
    const date = new Date(currentDate);
    
    const dayData = {
      day: date.getDate(),
      isCurrentMonth: true,
      date: date
    };
    
    return [[dayData]]; // Return as a single-day array within a "week"
  };
  
  // Choose the appropriate view
  let calendarData;
  if (viewMode === 'month') {
    calendarData = getMonthView();
  } else if (viewMode === 'week') {
    calendarData = getWeekView();
  } else {
    calendarData = getDayView();
  }
  
  // Get current date for highlighting today
  const today = new Date();
  const isToday = (date) => {
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Get appropriate title based on view mode
  const getViewTitle = () => {
    if (viewMode === 'month') {
      return `${getMonthName(currentDate)} ${getYear(currentDate)}`;
    } else if (viewMode === 'week') {
      const firstDay = calendarData[0][0].date;
      const lastDay = calendarData[0][6].date;
      const firstMonth = firstDay.toLocaleString('default', { month: 'short' });
      const lastMonth = lastDay.toLocaleString('default', { month: 'short' });
      
      if (firstMonth === lastMonth) {
        return `${firstDay.getDate()} - ${lastDay.getDate()} ${firstMonth} ${getYear(currentDate)}`;
      } else {
        return `${firstDay.getDate()} ${firstMonth} - ${lastDay.getDate()} ${lastMonth} ${getYear(currentDate)}`;
      }
    } else {
      return `${currentDate.getDate()} ${getMonthName(currentDate)} ${getYear(currentDate)}`;
    }
  };
  
  if (!employeeData) {
    return <div className="bg-white rounded-lg shadow p-4 w-full">
      <div className="text-center p-8">
        Loading employee data...
      </div>
    </div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full mt-6">
      {/* Calendar Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button 
            onClick={goToPrevious}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            &lt;
          </button>
          <button 
            onClick={goToNext}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            &gt;
          </button>
          <button 
            onClick={goToToday}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            today
          </button>
        </div>
        
        <h2 className="text-2xl font-bold">
          {getViewTitle()}
        </h2>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 border border-gray-300 rounded ${viewMode === 'month' ? 'bg-gray-200' : ''}`}
          >
            month
          </button>
          <button 
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 border border-gray-300 rounded ${viewMode === 'week' ? 'bg-gray-200' : ''}`}
          >
            week
          </button>
          <button 
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 border border-gray-300 rounded ${viewMode === 'day' ? 'bg-gray-200' : ''}`}
          >
            day
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="border border-gray-300 rounded overflow-hidden">
        {/* Weekday Headers */}
        <div className={`grid ${viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7'} bg-purple-900 text-white`}>
          {viewMode !== 'day' && <div className="py-2 text-center font-bold">Sun</div>}
          {viewMode !== 'day' && <div className="py-2 text-center font-bold">Mon</div>}
          {viewMode !== 'day' && <div className="py-2 text-center font-bold">Tue</div>}
          {viewMode !== 'day' && <div className="py-2 text-center font-bold">Wed</div>}
          {viewMode !== 'day' && <div className="py-2 text-center font-bold">Thu</div>}
          {viewMode !== 'day' && <div className="py-2 text-center font-bold">Fri</div>}
          {viewMode !== 'day' && <div className="py-2 text-center font-bold">Sat</div>}
          {viewMode === 'day' && <div className="py-2 text-center font-bold">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()]}
          </div>}
        </div>
        
        {/* Calendar Cells */}
        {calendarData.map((week, weekIndex) => (
          <div key={weekIndex} className={`grid ${viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
            {week.map((day, dayIndex) => {
              const dayAttendance = getAttendanceForDate(day.date);
              const isHighlighted = isToday(day.date);
              
              return (
                <div 
                  key={dayIndex} 
                  onClick={() => handleDateClick(day.date)}
                  className={`${viewMode === 'day' ? 'min-h-64' : 'min-h-28'} border border-gray-200 p-1 cursor-pointer ${
                    day.isCurrentMonth ? 
                      isHighlighted ? 'bg-blue-50' : 
                      day.date.getDay() === 0 ? 'bg-gray-50' : 'bg-white' 
                    : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <div className="text-right mb-2">{day.day}</div>
                  {dayAttendance && (
                    <div className="flex flex-col gap-1">
                      {dayAttendance.in && (
                        <div className="bg-green-600 text-white text-xs p-1 rounded">
                          IN: {dayAttendance.in}
                        </div>
                      )}
                      {dayAttendance.out && (
                        <div className="bg-red-600 text-white text-xs p-1 rounded">
                          OUT: {dayAttendance.out}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Status information - to show check-in data */}
      {employeeData.check_in_time && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900">Current Status</h3>
          <div className="mt-2 flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-700">
              Checked in at {new Date(employeeData.check_in_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })} - {employeeData.status_log === 'OL' ? 'Online' : 'Offline'}
            </span>
          </div>
          {employeeData.face_recognition_status === 'Y' && (
            <div className="mt-2 text-sm text-green-700">
              Face recognition verified
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;