// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// // Accepts allowedRoles as prop
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const token = useSelector((state) => state.auth.token);
//   const usertype = useSelector((state) => state.auth.user?.usertype);

//   if (!token) return <Navigate to="/login" />;
//   if (allowedRoles && !allowedRoles.includes(usertype)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
    useEffect(() => {
    // Simulate async state check (e.g., redux rehydration)
    const timeout = setTimeout(() => setLoading(false), 50);
    return () => clearTimeout(timeout);
  }, []);
   if (loading) return null;
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.usertype)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
