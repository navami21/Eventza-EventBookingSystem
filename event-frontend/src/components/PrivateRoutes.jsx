import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = ({ allowedRoles }) => {
  let token = null;
  let user = null;

  try {
    token = localStorage.getItem('logintoken');
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (err) {
    console.error("Invalid user data in localStorage", err);
    return <Navigate to="/login" replace />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
