import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faWater,
    faSeedling,
    faBars,
    faTimes,
    faHome,
    faCog,
    faChartLine,
    faFish, faLifeRing
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`bg-gray-800 p-6 z-30 shadow-lg h-screen transition-transform duration-300 ease-in-out ${
                    isOpen ? 'w-64' : 'w-16'
                }`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-white text-2xl font-bold transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>Menu</h1>
                    <button
                        className="text-white focus:outline-none"
                        onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg"/>
                    </button>
                </div>
                <ul className={`space-y-4 ${isOpen ? 'block' : 'hidden'}`}>
                    <li
                        className={`flex items-center p-3 rounded-lg ${
                            location.pathname === '/dashboard/home' ? 'bg-blue-700 text-white' : 'text-gray-300'
                        } hover:bg-blue-600 hover:text-white`}>
                        <FontAwesomeIcon icon={faHome} className="mr-3"/>
                        <Link to="/dashboard/home">Home</Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-lg ${
                            location.pathname === '/dashboard/farms' ? 'bg-blue-700 text-white' : 'text-gray-300'
                        } hover:bg-blue-600 hover:text-white`}>
                        <FontAwesomeIcon icon={faSeedling} className="mr-3"/>
                        <Link to="/dashboard/farms">Farm</Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-lg ${
                            location.pathname === '/dashboard/ponds' ? 'bg-blue-700 text-white' : 'text-gray-300'
                        } hover:bg-blue-600 hover:text-white`}>
                        <FontAwesomeIcon icon={faWater} className="mr-3"/>
                        <Link to="/dashboard/ponds">Pond</Link>
                    </li>

                    <li
                        className={`flex items-center p-3 rounded-lg ${
                            location.pathname === '/dashboard/settings' ? 'bg-blue-700 text-white' : 'text-gray-300'
                        } hover:bg-blue-600 hover:text-white`}>
                        <FontAwesomeIcon icon={faCog} className="mr-3"/>
                        <Link to="/dashboard/settings">Settings</Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-lg ${
                            location.pathname === '/dashboard/reports' ? 'bg-blue-700 text-white' : 'text-gray-300'
                        } hover:bg-blue-600 hover:text-white`}>
                        <FontAwesomeIcon icon={faChartLine} className="mr-3"/>
                        <Link to="/dashboard/reports">Reports</Link>
                    </li>
                </ul>
                <ul className={`flex flex-col items-center space-y-4 ${isOpen ? 'hidden' : 'block'}`}>
                    <li
                        className={`flex items-center p-3 rounded-full  ${
                            location.pathname === '/dashboard/home' ? 'bg-yellow-700 text-white' : 'text-gray-300 bg-blue-600'
                        } hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out`}>
                        <Link to="/dashboard/home" className="flex items-center w-full justify-center">
                            <FontAwesomeIcon icon={faHome} className="m-0 p-0"/>

                        </Link>
                    </li>

                    <li
                        className={`flex items-center p-3 rounded-full  ${
                            location.pathname === '/dashboard/farms' ? 'bg-yellow-700 text-white' : 'text-gray-300 bg-blue-600'
                        } hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out`}>
                        <Link to="/dashboard/farms" className="flex items-center w-full justify-center">
                            <FontAwesomeIcon icon={faSeedling} className="m-0 p-0"/>
                        </Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-full  ${
                            location.pathname === '/dashboard/ponds' ? 'bg-yellow-700 text-white' : 'text-gray-300 bg-blue-600'
                        } hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out`}>
                        <Link to="/dashboard/ponds" className="flex items-center w-full justify-center">
                            <FontAwesomeIcon icon={faWater} className="m-0 p-0"/>
                        </Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-full  ${
                            location.pathname === '/dashboard/fishes' ? 'bg-yellow-700 text-white' : 'text-gray-300 bg-blue-600'
                        } hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out`}>
                        <Link to="/dashboard/fishes" className="flex items-center w-full justify-center">
                            <FontAwesomeIcon icon={faFish} className="m-0 p-0"/>
                        </Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-full  ${
                            location.pathname === '/dashboard/culture-cycle' ? 'bg-yellow-700 text-white' : 'text-gray-300 bg-blue-600'
                        } hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out`}>
                        <Link to="/dashboard/culture-cycle" className="flex items-center w-full justify-center">
                            <FontAwesomeIcon icon={faLifeRing} className="m-0 p-0"/>
                        </Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-full  ${
                            location.pathname === '/dashboard/settings' ? 'bg-yellow-700 text-white' : 'text-gray-300 bg-blue-600'
                        } hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out`}>
                        <Link to="/dashboard/settings" className="flex items-center w-full justify-center">
                            <FontAwesomeIcon icon={faCog} className="m-0 p-0"/>
                        </Link>
                    </li>
                    <li
                        className={`flex items-center p-3 rounded-full  ${
                            location.pathname === '/dashboard/reports' ? 'bg-yellow-700 text-white' : 'text-gray-300 bg-blue-600'
                        } hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out`}>
                        <Link to="/dashboard/reports" className="flex items-center w-full justify-center">
                            <FontAwesomeIcon icon={faChartLine} className="m-0 p-0"/>
                        </Link>
                    </li>
                </ul>


            </div>


        </div>
    );
}

export default Sidebar;
