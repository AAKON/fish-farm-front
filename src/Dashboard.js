import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from "./TopBar";

function Dashboard() {
    return (
        <div className="flex flex-col h-screen">
            <TopBar/> {/* Add TopBar at the top */}
            <div className="flex flex-1">
                <Sidebar/>
                <div className="flex-1 p-6 bg-gray-100">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
