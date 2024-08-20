import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faWater,
    faSeedling,
    faBars,
    faTimes,
    faHome,
    faFish,
    faLifeRing,
    faUtensils,
    faChevronDown,
    faChevronUp, faWorm, faBowlRice, faUniversalAccess
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFeedMenuOpen, setFeedMenuOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleFeedMenu = () => {
        setFeedMenuOpen(!isFeedMenuOpen);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`bg-gray-800 p-4 z-30 shadow-lg h-screen transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'w-64' : 'w-20'
                }`}>

                <ul className="space-y-4">
                    <li className={`flex items-center p-4`}>
                        <button className="text-white focus:outline-none flex items-center"
                                onClick={toggleSidebar}>
                            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg"/>
                        </button>
                    </li>
                    <SidebarItem
                        to="/dashboard/home"
                        icon={faHome}
                        label="Home"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/home'}
                    />
                    <SidebarItem
                        to="/dashboard/farms"
                        icon={faSeedling}
                        label="Farm"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/farms'}
                    />
                    <SidebarItem
                        to="/dashboard/ponds"
                        icon={faWater}
                        label="Pond"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/ponds'}
                    />
                    <SidebarItem
                        to="/dashboard/fishes"
                        icon={faFish}
                        label="Fish"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/fishes'}
                    />
                    <SidebarItem
                        to="/dashboard/culture-cycle"
                        icon={faLifeRing}
                        label="Culture Cycle"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/culture-cycle'}
                    />
                    <SidebarItem
                        to="/dashboard/feed"
                        icon={faWorm}
                        label="Fish Feed"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/feed'}
                    />
                    <SidebarItem
                        to="/dashboard/feed-stocks"
                        icon={faBowlRice}
                        label="Fish Feed Stock"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/feed-stocks'}
                    />
                    <SidebarItem
                        to="/dashboard/access"
                        icon={faUniversalAccess}
                        label="Web Access"
                        isOpen={isOpen}
                        isActive={location.pathname === '/dashboard/access'}
                    />

                    {/* Feed Management with Sub-Menu */}
                    <li className={`flex flex-col hidden`}>
                        <div
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
                                location.pathname.startsWith('/dashboard/feed-management') ? 'bg-blue-600 text-white' : 'text-gray-300'
                            } hover:bg-blue-600 hover:text-white`}
                            onClick={toggleFeedMenu}
                        >
                            <FontAwesomeIcon icon={faUtensils} className="mr-3"/>
                            <span className={`transition-all duration-300 ease-in-out ${
                                isOpen ? 'opacity-100' : 'opacity-0 whitespace-nowrap'
                            }`}>
                                Feed Management
                            </span>
                            <FontAwesomeIcon
                                icon={isFeedMenuOpen ? faChevronUp : faChevronDown}
                                className={`ml-auto transition-all duration-300 ease-in-out ${
                                    isOpen ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        </div>
                        <ul className={`pl-6 mt-2 space-y-2 ${isFeedMenuOpen || location.pathname.startsWith('/dashboard/feed-management') ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
                            <SidebarSubItem
                                to="/dashboard/feed-management/feed"
                                label="Create"
                                isActive={location.pathname === '/dashboard/feed-management/feed'}
                            />
                            <SidebarSubItem
                                to="/dashboard/feed-management/stock"
                                label="Stock"
                                isActive={location.pathname === '/dashboard/feed-management/stock'}
                            />
                            <SidebarSubItem
                                to="/dashboard/feed-management/report"
                                label="Report"
                                isActive={location.pathname === '/dashboard/feed-management/report'}
                            />
                        </ul>
                    </li>

                    {/*<SidebarItem*/}
                    {/*    to="/dashboard/settings"*/}
                    {/*    icon={faCog}*/}
                    {/*    label="Settings"*/}
                    {/*    isOpen={isOpen}*/}
                    {/*    isActive={location.pathname === '/dashboard/settings'}*/}
                    {/*/>*/}
                    {/*<SidebarItem*/}
                    {/*    to="/dashboard/reports"*/}
                    {/*    icon={faChartLine}*/}
                    {/*    label="Reports"*/}
                    {/*    isOpen={isOpen}*/}
                    {/*    isActive={location.pathname === '/dashboard/reports'}*/}
                    {/*/>*/}
                </ul>
            </div>
        </div>
    );
}

// SidebarItem Component
function SidebarItem({to, icon, label, isOpen, isActive}) {
    return (
        <li
            className={`flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out ${
                isActive ? 'bg-blue-700 text-white' : 'text-gray-300'
            } hover:bg-blue-600 hover:text-white`}>
            <Link to={to} className="flex items-center w-full">
                <FontAwesomeIcon icon={icon} className={`mr-3 transition-all duration-300 ease-in-out ${
                    isOpen ? 'text-lg' : 'text-2xl'
                }`}/>
                <span className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-100' : 'opacity-0 whitespace-nowrap'
                }`}>
                    {label}
                </span>
            </Link>
        </li>
    );
}

// SidebarSubItem Component
function SidebarSubItem({ to, label, isActive }) {
    return (
        <li
            className={`flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out ${
                isActive ? 'bg-blue-700 text-white' : 'text-gray-300'
            } hover:bg-blue-600 hover:text-white`}>
            <Link to={to} className="flex items-center w-full">
                {label}
            </Link>
        </li>
    );
}

export default Sidebar;
