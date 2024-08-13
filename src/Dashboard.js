import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Dashboard() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;
