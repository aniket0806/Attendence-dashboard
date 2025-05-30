// controllers/adminController.js
import { getAdminDashboardData,getEmployeesByDepartment, getEmployeeDetails,getEmployeeAttendance, getSearch } from "../models/adminDashBoard.js";

export const getDashboardData = async (req, res) => {
    try {
        const dashboardData = await getAdminDashboardData();
        res.status(200).json(dashboardData);
        
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};

export const getDepartmentEmployees = async (req, res) => {
    const { departmentCode} = req.query; // Get department code and date from query parameters
    const {date} = req.params;

    try {
        const employees = await getEmployeesByDepartment(departmentCode, date);
        
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch department employees" });
    }
};

export const getEmployeeDetail = async (req, res) => {
    const { username } = req.params; // Get username from request parameters
    try {
        const employeeDetails = await getEmployeeDetails(username);
          if (!employeeDetails) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json(employeeDetails);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch employee details" });
    }
}

export const getEmployeeAttendances = async (req, res) => {
    const { username } = req.params;

    try {
        const employeeAttendance = await getEmployeeAttendance(username);

        if (!employeeAttendance || employeeAttendance.length === 0) {
            return res.status(404).json({ error: "Attendance not found for this employee." });
        }

        // ✅ Send response with correct key
        res.status(200).json({ attendance: employeeAttendance });
    } catch (error) {
        console.error("Error in getEmployeeAttendances:", error);
        res.status(500).json({ error: "Failed to fetch employee attendance" });
    }
};
export const getSearchEmployee = async (req, res) => {
  try {
    const { q } = req.query; // Get query parameter, not params
    
    // Validate query parameter
    if (!q || q.length < 3) {
      return res.json([]);
    }
    
    const searchResults = await getSearch(q);
    return res.status(200).json(searchResults);
    
  } catch (error) {
    console.error("Error in Search:", error);
    res.status(500).json({ 
      error: "Failed to fetch employee search results",
      message: error.message 
    });
  }
}