import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DepartmentsEmployees from "./pages/DepartmentsWiseEmployees/DepartmentsEmployees";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import AttendanceDetail from "./pages/Employee/AttendanceDetail";
import Employees from "./pages/Masters/Employees";
import Designation from "./pages/Masters/Designation";
import Departments from "./pages/Masters/Departments";
import WorkLocations from "./pages/Masters/WorkLocations";

const ProtectedPage = ({ children, allowedRoles }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <Dashboard />
          </ProtectedPage>
        }
      />
      <Route
        path="/department/:departmentCode"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <DepartmentsEmployees />
          </ProtectedPage>
        }
      />
      <Route
        path="/employeedashboard/:username"
        element={
          <ProtectedPage allowedRoles={['A','M','E']}>
            <EmployeeDashboard />
          </ProtectedPage>
        }
      />
      <Route
        path="/employee/:username/attendance-detail/:date"
        element={
          <ProtectedPage allowedRoles={['A','M','E']}>
            <AttendanceDetail />
          </ProtectedPage>
        }
      />

      {/* Masters */}
      <Route
        path="/masters/employees"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <Employees />
          </ProtectedPage>
        }
      />
      <Route
        path="/masters/designation"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <Designation />
          </ProtectedPage>
        }
      />
      <Route
        path="/masters/departments"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <Departments />
          </ProtectedPage>
        }
      />
      <Route
        path="/masters/worklocation"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <WorkLocations />
          </ProtectedPage>
        }
      />
    </Routes>
  );
}

export default App;
