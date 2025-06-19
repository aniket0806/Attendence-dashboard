// Layout.js
import { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - conditionally rendered */}
      <Sidebar isOpen={isSidebarOpen} />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Fixed Header */}
        <div className={`fixed top-0 right-0 z-10 transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-0'}`}>
          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
        
        {/* Content */}
        <div className="flex-1 pt-15 p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;