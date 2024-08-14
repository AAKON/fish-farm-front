import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                // If there is no token, redirect to the login page
                setIsLoading(false);
                setIsValidToken(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/validate-token`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.valid) {
                    setIsValidToken(true);
                } else {
                    localStorage.removeItem('token');
                    setIsValidToken(false);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setIsValidToken(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, []);

    if (isLoading) {
        // You can return a loading spinner or some other loading indication here
        return <div>Loading...</div>;
    }

    if (!isValidToken) {
        return <Navigate to="/login" />;
    }

    // If the token is valid, render the children components
    return children;
}

export default ProtectedRoute;
