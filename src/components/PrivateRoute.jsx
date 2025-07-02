// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  return isLoggedIn ? children : <Navigate to="/loginadmin" />;
};

export default PrivateRoute;