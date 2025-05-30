import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { loginSuccess } from "../features/auth/authSlice";

const ProfileDropdown = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(loginSuccess({ user: null, token: null }));
    navigate("/login");
  };

  const handleProfile = () => {
    navigate(`/employeedashboard/${user?.username}`);
    setIsOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/change-password"); // Make sure this route exists
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
          {firstLetter}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button
            onClick={handleProfile}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={handleChangePassword}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
