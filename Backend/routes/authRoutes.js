import  Routes from "express";
import loginMiddleware, {allowRoles} from "../middlewares/AuthMiddle.js";
import { login } from "../controllers/auth.js";
import { getDashboardData , getDepartmentEmployees, getEmployeeAttendances, getEmployeeDetail, getSearchEmployee } from "../controllers/dashBoard.js";
import { getdepartments, getdesignation, getMastersEmployees, getworklocation } from "../controllers/Masters.js";
const authRoutes = Routes();
// Example route
authRoutes.post("/login", login);
authRoutes.get("/",loginMiddleware,allowRoles("A"),getDashboardData);
authRoutes.get("/departmentsemployees",getDepartmentEmployees);
authRoutes.get("/employeedashboard/:username",loginMiddleware,allowRoles("A","M","E"),getEmployeeDetail);
authRoutes.get("/employee/attendance/:username",getEmployeeAttendances);
authRoutes.get("/search", getSearchEmployee);
// Master list 
authRoutes.get("/getallemployees", getMastersEmployees);
authRoutes.get("/department", getdepartments);
authRoutes.get("/designation", getdesignation);
authRoutes.get("/worklocation", getworklocation);
export default authRoutes;