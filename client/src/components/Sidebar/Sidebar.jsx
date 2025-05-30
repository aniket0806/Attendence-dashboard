
// import { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ChevronDown, ChevronUp, Layout, FileText, Users, User, Settings } from 'lucide-react';
// import LOGO from "../../assets/image/logo.jpg"; 
// import { useSelector } from 'react-redux';

// const Sidebar = ({ isOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
 
//   const user = useSelector((state)=>state.auth.user);
//   const role =  user.usertype;
 
  
//   // Track which menu is expanded - only one at a time
//   const [expandedMenu, setExpandedMenu] = useState('dashboard');
  
//   // Toggle menu - if same clicked, close it; else open clicked menu and close others
//   const toggleMenu = (menu) => {
//     setExpandedMenu(prev => (prev === menu ? null : menu));
//   };
  
//   // Check if current path includes a specific route
//   const isActive = (path) => {
//     return location.pathname.includes(path);
//   };
  
//   // Determine if submenu item is active (exact match)
//   const isSubMenuActive = (path) => {
//     return location.pathname === path;
//   };


  

//   return (
//     <div className={`w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10 transition-transform duration-300 ${
//       isOpen ? 'translate-x-0' : '-translate-x-full'
//     }`}>
//       {/* Logo Section */}
//       <div className="p-4 flex flex-col items-center">
//         <img src={LOGO} alt="NHDC Logo" className="mb-0.5" />
//       </div>
      
//       <div className="p-4">
//         <p className="text-xs font-medium text-gray-400 mb-4 tracking-wide">MAIN MENU</p>
        
//         {/* Dashboard */}
//         <div className="mb-1">
//           <div 
//             className={`flex items-center px-3 py-2 cursor-pointer rounded ${
//               isActive('/') ? 'bg-gray-100' : 'hover:bg-gray-50'
//             }`}
//             onClick={() => toggleMenu('dashboard')}
//           >
//             <Layout className="w-4 h-4 mr-3 text-gray-600" />
//             <span className="text-gray-700 text-sm font-medium flex-1">Dashboard</span>
//             <div className="text-gray-500">
//               {expandedMenu === 'dashboard' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//           </div>
          
//           {expandedMenu === 'dashboard' && (
//             <div className="ml-7 mt-1">
//               <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/')}
//               >
//                 Admin Dashboard
//               </div>
//               {/* <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/employee-dashboard') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/employee-dashboard')}
//               >
//                 Employee Dashboard
//               </div> */}
//             </div>
//           )}
//         </div>
        
//         {/* Report */}
//         <div className="mb-1">
//           <div 
//             className={`flex items-center px-3 py-2 cursor-pointer rounded ${
//               isActive('/report') ? 'bg-gray-100' : 'hover:bg-gray-50'
//             }`}
//             onClick={() => toggleMenu('report')}
//           >
//             <FileText className="w-4 h-4 mr-3 text-gray-600" />
//             <span className="text-gray-700 text-sm font-medium flex-1">Report</span>
//             <div className="text-gray-500">
//               {expandedMenu === 'report' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//           </div>
          
//           {expandedMenu === 'report' && (
//             <div className="ml-7 mt-1">
//               <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/employees-attendance-report') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/employees-attendance-report')}
//               >
//                 Employees Attendance Report
//               </div>
//               <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/salary-preparation-report') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/salary-preparation-report')}
//               >
//                 Salary Preparation Report
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Masters */}
//         <div className="mb-1">
//           <div 
//             className={`flex items-center px-3 py-2 cursor-pointer rounded ${
//               isActive('/masters') ? 'bg-gray-100' : 'hover:bg-gray-50'
//             }`}
//             onClick={() => toggleMenu('masters')}
//           >
//             <Users className="w-4 h-4 mr-3 text-gray-600" />
//             <span className="text-gray-700 text-sm font-medium flex-1">Masters</span>
//             <div className="text-gray-500">
//               {expandedMenu === 'masters' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//             </div>
//           </div>
          
//           {expandedMenu === 'masters' && (
//             <div className="ml-7 mt-1">
//               <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/masters/employees') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/masters/employees')}
//               >
//                 Employees
//               </div>
//               <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/masters/departments') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/masters/departments')}
//               >
//                 Departments
//               </div>
//               <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/masters/designation') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/masters/designation')}
//               >
//                 Designations
//               </div>
//               <div 
//                 className={`py-2 px-3 text-sm cursor-pointer rounded ${
//                   isSubMenuActive('/masters/worklocation') 
//                     ? 'text-orange-500 font-medium bg-orange-50' 
//                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//                 }`}
//                 onClick={() => navigate('/masters/worklocation')}
//               >
//                 Worklocation
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Contacts */}
//         <div 
//           className={`flex items-center px-3 py-2 cursor-pointer mb-1 rounded ${
//             isActive('/contacts') ? 'bg-gray-100' : 'hover:bg-gray-50'
//           }`}
//           onClick={() => navigate('/contacts')}
//         >
//           <User className="w-4 h-4 mr-3 text-gray-600" />
//           <span className="text-gray-700 text-sm font-medium">Contacts</span>
//         </div>
        
//         {/* Settings */}
//         <div 
//           className={`flex items-center px-3 py-2 cursor-pointer mb-1 rounded ${
//             isActive('/settings') ? 'bg-gray-100' : 'hover:bg-gray-50'
//           }`}
//           onClick={() => navigate('/settings')}
//         >
//           <Settings className="w-4 h-4 mr-3 text-gray-600" />
//           <span className="text-gray-700 text-sm font-medium">Settings</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronUp, Layout, FileText, Users, User, Settings } from 'lucide-react';
import LOGO from "../../assets/image/logo.jpg";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const role = user?.usertype;

  const [expandedMenu, setExpandedMenu] = useState('dashboard');

  const toggleMenu = (menu) => {
    setExpandedMenu(prev => (prev === menu ? null : menu));
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const isSubMenuActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 flex flex-col items-center">
        <img src={LOGO} alt="NHDC Logo" className="mb-0.5" />
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-gray-400 mb-4 tracking-wide">MAIN MENU</p>

        {/* === ADMIN MENU === */}
        {role === 'A' && (
          <>
            {/* Dashboard */}
            <div className="mb-1">
              <div 
                className={`flex items-center px-3 py-2 cursor-pointer rounded ${isActive('/') ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => toggleMenu('dashboard')}
              >
                <Layout className="w-4 h-4 mr-3 text-gray-600" />
                <span className="text-gray-700 text-sm font-medium flex-1">Dashboard</span>
                <div className="text-gray-500">
                  {expandedMenu === 'dashboard' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {expandedMenu === 'dashboard' && (
                <div className="ml-7 mt-1">
                  <div 
                    className={`py-2 px-3 text-sm cursor-pointer rounded ${
                      isSubMenuActive('/') ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => navigate('/')}
                  >
                    Admin Dashboard
                  </div>
                </div>
              )}
            </div>

            {/* Report */}
            <div className="mb-1">
              <div 
                className={`flex items-center px-3 py-2 cursor-pointer rounded ${isActive('/report') ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => toggleMenu('report')}
              >
                <FileText className="w-4 h-4 mr-3 text-gray-600" />
                <span className="text-gray-700 text-sm font-medium flex-1">Report</span>
                <div className="text-gray-500">
                  {expandedMenu === 'report' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {expandedMenu === 'report' && (
                <div className="ml-7 mt-1">
                  <div 
                    className={`py-2 px-3 text-sm cursor-pointer rounded ${
                      isSubMenuActive('/employees-attendance-report') ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => navigate('/employees-attendance-report')}
                  >
                    Employees Attendance Report
                  </div>
                  <div 
                    className={`py-2 px-3 text-sm cursor-pointer rounded ${
                      isSubMenuActive('/salary-preparation-report') ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => navigate('/salary-preparation-report')}
                  >
                    Salary Preparation Report
                  </div>
                </div>
              )}
            </div>

            {/* Masters */}
            <div className="mb-1">
              <div 
                className={`flex items-center px-3 py-2 cursor-pointer rounded ${isActive('/masters') ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => toggleMenu('masters')}
              >
                <Users className="w-4 h-4 mr-3 text-gray-600" />
                <span className="text-gray-700 text-sm font-medium flex-1">Masters</span>
                <div className="text-gray-500">
                  {expandedMenu === 'masters' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {expandedMenu === 'masters' && (
                <div className="ml-7 mt-1">
                  <div className={`py-2 px-3 text-sm cursor-pointer rounded ${isSubMenuActive('/masters/employees') ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`} onClick={() => navigate('/masters/employees')}>Employees</div>
                  <div className={`py-2 px-3 text-sm cursor-pointer rounded ${isSubMenuActive('/masters/departments') ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`} onClick={() => navigate('/masters/departments')}>Departments</div>
                  <div className={`py-2 px-3 text-sm cursor-pointer rounded ${isSubMenuActive('/masters/designation') ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`} onClick={() => navigate('/masters/designation')}>Designations</div>
                  <div className={`py-2 px-3 text-sm cursor-pointer rounded ${isSubMenuActive('/masters/worklocation') ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`} onClick={() => navigate('/masters/worklocation')}>Worklocation</div>
                </div>
              )}
            </div>

            {/* Contacts */}
            <div className={`flex items-center px-3 py-2 cursor-pointer mb-1 rounded ${isActive('/contacts') ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => navigate('/contacts')}>
              <User className="w-4 h-4 mr-3 text-gray-600" />
              <span className="text-gray-700 text-sm font-medium">Contacts</span>
            </div>

            {/* Settings */}
            <div className={`flex items-center px-3 py-2 cursor-pointer mb-1 rounded ${isActive('/settings') ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-3 text-gray-600" />
              <span className="text-gray-700 text-sm font-medium">Settings</span>
            </div>
          </>
        )}

        {/* === EMPLOYEE MENU === */}
        {role === 'E' || 'M'  && (
          <>
            <div className="mb-1">
              <div 
                className={`flex items-center px-3 py-2 cursor-pointer rounded ${isActive('/employeedashboard') ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => toggleMenu('employeeDashboard')}
              >
                <Layout className="w-4 h-4 mr-3 text-gray-600" />
                <span className="text-gray-700 text-sm font-medium flex-1">My Dashboard</span>
                <div className="text-gray-500">
                  {expandedMenu === 'employeeDashboard' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>
              {expandedMenu === 'employeeDashboard' && (
                <div className="ml-7 mt-1">
                  <div 
                    className={`py-2 px-3 text-sm cursor-pointer rounded ${
                      isSubMenuActive(`/employeedashboard/${user.username}`) ? 'text-orange-500 font-medium bg-orange-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => navigate(`/employeedashboard/${user.username}`)}
                  >
                    Employee Dashboard
                  </div>
                </div>
              )}
            </div>

            {/* Settings (Optional for Employees) */}
            <div className={`flex items-center px-3 py-2 cursor-pointer mb-1 rounded ${isActive('/settings') ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-3 text-gray-600" />
              <span className="text-gray-700 text-sm font-medium">Settings</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

