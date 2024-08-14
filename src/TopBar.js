import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function TopBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem('token');

        // Redirect to the login page
        navigate('/login');
    };

    return (
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
            >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
            </button>
        </div>
    );
}

export default TopBar;
