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
import EmployeesAttendance from "./pages/Reports/EmployeesAttendance";
import SalaryPreparation from "./pages/Reports/SalaryPreparation";
import Unauthorized from "./pages/Error/Unauthorized";
import NotFound from "./pages/Error/NotFound";
import DepartmentsEdit from "./pages/Masters/Edit/DepartmentsEdit";
import DesignationEdit from "./pages/Masters/Edit/DesignationEdit";
import WorkLocationEdit from "./pages/Masters/Edit/WorkLocationEdit";

import Contacts from "./pages/Contacts";
import Setting from "./pages/Setting";
import DepartmentsAdd from "./pages/Masters/Add/DepartmentsAdd";
import DesignationAdd from "./pages/Masters/Add/DesignationAdd";
import WorkLocationAdd from "./pages/Masters/Add/WorkLocationAdd";
import EmployeeEdit from "./pages/Masters/Edit/EmployeeEdit";
import EmployeeAdd from "./pages/Masters/Add/EmployeeAdd";
import ChangePassword from "./pages/changePassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProtectedPage = ({ children, allowedRoles }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <>
    <Routes>
      <Route path="/Login" element={<Login />} />
      
      <Route path="/unauthorized" element={<Unauthorized />} />
<Route path="*" element={<NotFound />} />


    <Route path="/change-password"  element={
      <ProtectedPage allowedRoles={['A' ,' M', 'E']}><ChangePassword /></ProtectedPage>
      } />
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
        path="/employee/add"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <EmployeeAdd />
          </ProtectedPage>
        }
      />
       <Route
        path="/employees/edit/:id"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <EmployeeEdit />
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
        path="/designations/edit/:id"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <DesignationEdit />
          </ProtectedPage>
        }
      />
      <Route
        path="/designation/add"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <DesignationAdd />
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
  path="/departments/edit/:id"
  element={
    <ProtectedPage allowedRoles={['A']}>
      <DepartmentsEdit />
    </ProtectedPage>
  }
/>
      <Route
  path="/departments/add"
  element={
    <ProtectedPage allowedRoles={['A']}>
      <DepartmentsAdd />
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
      <Route
        path="/worklocation/add"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <WorkLocationAdd />
          </ProtectedPage>
        }
      />
      <Route
        path="/worklocation/edit/:id"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <WorkLocationEdit />
          </ProtectedPage>
        }
      />
      <Route
        path="/report/employee-attendance"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <EmployeesAttendance />
          </ProtectedPage>
        }
      />
      <Route
        path="/report/salary-preparation"
        element={
          <ProtectedPage allowedRoles={['A']}>
            <SalaryPreparation />
          </ProtectedPage>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedPage allowedRoles={['A','M','E']}>
            <Contacts />
          </ProtectedPage>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedPage allowedRoles={['A', 'M', 'E']}>
            <Setting />
          </ProtectedPage>
        }
      />
    </Routes>

     <ToastContainer position="top-right" autoClose={3000} />
     </>
  );
}

export default App;
