import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Accepts allowedRoles as prop
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = useSelector((state) => state.auth.token);
  const usertype = useSelector((state) => state.auth.user?.usertype);

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(usertype)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
