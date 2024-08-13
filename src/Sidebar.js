import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="h-screen bg-gray-800 text-white w-64">
            <div className="p-4 text-2xl font-bold">
                Dashboard
            </div>
            <ul className="mt-8">
                <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to="/dashboard/home">Home</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to="/dashboard/profile">Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to="/dashboard/settings">Settings</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-700">
                    <Link to="/dashboard/reports">Reports</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
