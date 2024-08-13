import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        // If there is no token, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If the token is present, render the children components
    return children;
}

export default ProtectedRoute;
