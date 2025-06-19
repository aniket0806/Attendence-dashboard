import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../features/notifications/notificationSlice";
import socket from "../lib/socket";
import {
  Building,
  CalendarClock,
  LogOut,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { data: dashboardData, loading, error } = useSelector((state) => state.dashboard);
  const notifications = useSelector((state) => state.notifications.list);
  
  // Refs
  const notificationScrollRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Fetch dashboard once
  useEffect(() => {
    if (!dashboardData) {
      dispatch(fetchDashboard());
    }
  }, [dashboardData, dispatch]);

  // Socket connection status tracking
  useEffect(() => {
    const handleConnect = () => {
      console.log("📡 Dashboard: Socket connected");
      setSocketConnected(true);
    };

    const handleDisconnect = () => {
      console.log("📡 Dashboard: Socket disconnected");
      setSocketConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Set initial connection status
    setSocketConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // Setup socket and notification listener
  // old
  // useEffect(() => {
  //   const handleAttendanceNotification = (data) => {
  //     console.log("🔔 Received attendance notification:", data);
  //     console.log("[Socket] Notification handler triggered", data);
  //     // Map the backend data structure to frontend expectations
  //     const notification = {
  //       name: data.name || 'Unknown User',
  //       department_name: data.department || 'Unknown Department',
  //       time: data.time || new Date().toLocaleTimeString(),
  //       type: data.activity || 'unknown',
  //       timestamp: data.timestamp || new Date().toISOString()
  //     };

  //     // Add to notification list
  //     dispatch(addNotification(notification));

  //     // Determine activity type for toast message
  //     let activityMessage = '';
  //     switch (data.activity?.toLowerCase()) {
  //       case 'check_in':
  //         activityMessage = 'checked in';
  //         break;
  //       case 'check_out':
  //         activityMessage = 'checked out';
  //         break;
  //       case 'break_in':
  //         activityMessage = 'started break';
  //         break;
  //       case 'break_out':
  //         activityMessage = 'ended break';
  //         break;
  //       default:
  //         activityMessage = `performed ${data.activity || 'an activity'}`;
  //     }

  //     // Show toast notification
  //     toast.info(
  //       `${notification.name} from ${notification.department_name} ${activityMessage} at ${notification.time}`,
  //       {
  //         position: "top-right",
  //         autoClose: 4000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //       }
  //     );
  //   };

  //   // Listen for attendance notifications
  //   socket.on("attendance:mark", handleAttendanceNotification);

  //   return () => {
  //     socket.off("attendance:mark", handleAttendanceNotification);
  //   };
  // }, [dispatch]);

  // Update your existing socket notification handler in Dashboard.js
useEffect(() => {
  const handleAttendanceNotification = (data) => {
    console.log("🔔 Received attendance notification:", data);
    
    // Create notification object
    const notification = {
      name: data.name || 'Unknown User',
      department_name: data.department || 'Unknown Department',
      time: data.time || new Date().toLocaleTimeString(),
      type: data.activity || 'unknown',
      timestamp: data.timestamp || new Date().toISOString()
    };

    // Add to notification list
    dispatch(addNotification(notification));

    // Update dashboard data based on activity type
    dispatch((dispatch, getState) => {
      const currentState = getState().dashboard.data;
      const updatedData = { ...currentState };
      const today = new Date().toISOString().split("T")[0];

      // Find or create department entry
      let deptIndex = updatedData.deptSummary?.findIndex(
        d => d.department_code === data.department
      ) ?? -1;

      if (deptIndex === -1 && updatedData.deptSummary) {
        updatedData.deptSummary.push({
          department_code: data.department,
          total_employees: 0,
          present_count: 0,
          out_count: 0,
          attendance_percentage: "0.00"
        });
        deptIndex = updatedData.deptSummary.length - 1;
      }

      // Update counts based on activity
      switch (data.activity?.toLowerCase()) {
        case 'check_in':
          if (updatedData.deptSummary?.[deptIndex]) {
            updatedData.deptSummary[deptIndex].present_count += 1;
            updatedData.deptSummary[deptIndex].total_employees += 1;
          }
          break;
          
        case 'check_out':
          if (updatedData.deptSummary?.[deptIndex]) {
            updatedData.deptSummary[deptIndex].out_count += 1;
          }
          break;
      }

      // Recalculate percentages
      if (updatedData.deptSummary?.[deptIndex]) {
        const dept = updatedData.deptSummary[deptIndex];
        dept.attendance_percentage = (
          (dept.present_count / Math.max(dept.total_employees, 1)) * 100
        ).toFixed(2);
      }

      // Update dashboard state
      dispatch({
        type: 'dashboard/updateData',
        payload: updatedData
      });
    });

    // Show toast
    let activityMessage = '';
    switch (data.activity?.toLowerCase()) {
      case 'check_in': activityMessage = 'checked in'; break;
      case 'check_out': activityMessage = 'checked out'; break;
      case 'break_in': activityMessage = 'started break'; break;
      case 'break_out': activityMessage = 'ended break'; break;
      default: activityMessage = `performed ${data.activity || 'an activity'}`;
    }

    toast.info(
      `${notification.name} from ${notification.department_name} ${activityMessage} at ${notification.time}`,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  socket.on("attendance:mark", handleAttendanceNotification);
  return () => socket.off("attendance:mark", handleAttendanceNotification);
}, [dispatch]);




// Inside your Dashboard or socket setup file
useEffect(() => {
  socket.on('test:notification', (data) => {
    console.log(' TEST NOTIFICATION RECEIVED:', data);
    toast.success(`Test Socket: ${data.message}`);
  });

  return () => {
    socket.off('test:notification');
  };
}, []);
  // Auto-scroll notifications
  useEffect(() => {
    if (notificationScrollRef.current) {
      notificationScrollRef.current.scrollTop = notificationScrollRef.current.scrollHeight;
    }
  }, [notifications]);

  // Early returns for loading and error
  if (loading)
    return (
      <div className="flex justify-center items-center py-5">
        Loading dashboard...
      </div>
    );
  
  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );

  // Calculate summary stats
  const today = new Date().toISOString().split("T")[0];
  const totalCheckins =
    dashboardData?.employeeAttendance?.filter((entry) => {
      if (!entry.check_in_time) return false;
      const entryDate = new Date(entry.check_in_time)
        .toISOString()
        .split("T")[0];
      return entryDate === today;
    }).length || 0;
  
  const totalCheckouts =
    dashboardData?.employeeAttendance?.filter((entry) => {
      if (!entry.check_out_time) return false;
      const entryDate = new Date(entry.check_out_time)
        .toISOString()
        .split("T")[0];
      return entryDate === today;
    }).length || 0;

  const outOfOffice =
    dashboardData?.employeeAttendance?.filter((e) => {
      if (!e.check_out_time) return false;
      const entryDate = new Date(e.check_out_time).toISOString().split("T")[0];
      return entryDate === today;
    }).length || 0;
  
  const lateReporting =
    dashboardData?.employeeAttendance?.filter((e) => {
      if (!e.check_in_time) return false;
      const checkInHour = new Date(e.check_in_time).getHours();
      return checkInHour > 10;
    }).length || 0;

  // Extract department data from the API response
  let departmentData = [];

  // First check if we have direct department data
  if (Array.isArray(dashboardData?.deptSummary)) {
    departmentData = dashboardData.deptSummary;
  }
  // Next check if it's provided as numeric keys in the root
  else if (dashboardData && typeof dashboardData === "object") {
    const numericKeys = Object.keys(dashboardData).filter(
      (key) => !isNaN(key) && dashboardData[key]?.total_employees !== undefined
    );

    if (numericKeys.length > 0) {
      departmentData = numericKeys.map((key) => dashboardData[key]);
    }
    // If we still don't have department data, try to extract it from employee data
    else if (Array.isArray(dashboardData.employeeAttendance)) {
      // Group employees by department code
      const deptMap = new Map();

      dashboardData.employeeAttendance.forEach((employee) => {
        if (employee.department_code) {
          // If department exists, add to employee count
          if (deptMap.has(employee.department_code)) {
            const dept = deptMap.get(employee.department_code);
            dept.total_employees++;
            if (employee.attendance_status === "Present") {
              dept.present_count++;
            }
          }
          // Otherwise create new department entry
          else {
            deptMap.set(employee.department_code, {
              department_code: employee.department_code,
              total_employees: 1,
              present_count: employee.attendance_status === "Present" ? 1 : 0,
              attendance_percentage: "0.00", // Will calculate later
            });
          }
        }
      });

      // Calculate percentages and format the final department data
      departmentData = Array.from(deptMap.values()).map((dept) => {
        const percentage =
          dept.total_employees > 0
            ? ((dept.present_count / dept.total_employees) * 100).toFixed(2)
            : "0.00";

        return {
          ...dept,
          attendance_percentage: percentage,
        };
      });
    }
  }

  // Sort by department code
  departmentData.sort((a, b) =>
    a.department_code.localeCompare(b.department_code)
  );

  const handleDepartmentClick = (departmentCode) => {
    if (!departmentCode) return;
    const today = new Date().toISOString().split("T")[0];
    navigate(`/department/${encodeURIComponent(departmentCode)}?date=${today}`);
  };

  // Use sample data if no department data is available
  const displayDepartments = departmentData.length > 0 ? departmentData : [];

  // Helper function to format activity type for display
  const formatActivityType = (type) => {
    switch (type?.toLowerCase()) {
      case 'check_in':
        return 'in';
      case 'check_out':
        return 'out';
      case 'break_in':
        return 'break in';
      case 'break_out':
        return 'break out';
      default:
        return type || 'activity';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-fit">
      {/* Connection Status Indicator (for debugging) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className={`mb-2 p-2 text-xs rounded ${socketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          Socket: {socketConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>
      )} */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Total Checkin Today */}
        <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <Building className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
              {totalCheckins}
            </span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">
                  Total Checkin Today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Out of Office Now */}
        <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <CalendarClock className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
              {outOfOffice}
            </span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">
                  Out of Office Now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Checkout Today */}
        <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <LogOut className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
              {totalCheckouts}
            </span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">
                  Total Checkout Today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Late Reporting */}
        <div className="bg-white rounded-md shadow w-full h-40 p-3 relative">
          <div className="bg-gray-800 p-1.5 rounded absolute right-3 top-10">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col h-full">
            <span className="text-3xl font-bold absolute top-10 left-3">
              {lateReporting}
            </span>
            <div className="absolute bottom-2 left-3 right-3">
              <div className="border-t-2 border-gray-300 pt-2">
                <span className="text-sm text-black font-bold">
                  Late Reporting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department Cards - Takes 2 columns */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3">
            Department-wise Attendance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {displayDepartments.map((dept, index) => {
              // Ensure we have valid numbers
              const totalEmployees = Number(dept.total_employees) || 0;
              const presentCount = Number(dept.present_count) || 0;
              const outCount = Number(dept.out_count) || 0;

              // Calculate percentage safely
              const percentage =
                totalEmployees > 0
                  ? Math.round((presentCount / totalEmployees) * 100)
                  : 0;

              // Determine card color
              let bgColor = "bg-gray-500"; // Default for no employees
              if (totalEmployees > 0) {
                bgColor =
                  percentage >= 80
                    ? "bg-green-700"
                    : percentage >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500";
              }

              return (
                <div
                  key={`dept-${index}`}
                  className={`${bgColor} uppercase rounded-md shadow text-white p-1.5 text-center cursor-pointer transform transition-transform duration-300 hover:scale-105`}
                  onClick={() =>
                    dept.department_code &&
                    handleDepartmentClick(dept.department_code)
                  }
                >
                  <div className="text-xs font-semibold mb-1 border-b truncate">
                    {dept.department_code || "Unassigned"}
                    <div className="text-xs font-semibold text-gray-200">
                      {totalEmployees}
                    </div>
                  </div>

                  <div className="text-xs font-bold">
                    IN: {presentCount} | OUT: {outCount}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification Section */}
        <div className="bg-white p-4 rounded-md shadow h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">
              Notification {socketConnected && <span className="text-green-500 text-xs">●</span>}
            </h2>
            <div className="bg-white border border-gray-300 rounded px-2 py-1 text-xs">
              Same day
            </div>
          </div>

          <div
            ref={notificationScrollRef}
            className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1"
          >
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400">No notifications yet.</p>
            ) : (
              notifications.map((note, idx) => (
                <div
                  key={idx}
                  className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 text-xs p-2 rounded shadow-sm"
                >
                  <strong>{note.name}</strong> from{" "}
                  <strong>{note.department_name}</strong> checked{" "}
                  {formatActivityType(note.type)} at{" "}
                  <span className="font-mono">{note.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;