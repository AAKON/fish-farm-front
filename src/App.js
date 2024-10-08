import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Home from './Home';
import Settings from './Settings';
import Reports from './Reports';
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from './ProtectedRoute';
import Farm from "./Farm";
import Pond from "./Pond";
import './App.css';
import Fish from "./Fish";
import CultureCycle from "./CultureCycle";
import FeedManagementStock from "./FeedManagementStock";
import FeedManagementReport from "./FeedManagementReport";
import Feed from "./Feed";
import FeedStock from "./FeedStock";
import RolePermissionPage from "./RolePermissionPage";
import AssignRole from "./AssignRole"; // Import your CSS file

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }>
                        <Route path="home" element={<Home />} />
                        <Route path="farms" element={<Farm />} />
                        <Route path="ponds" element={<Pond />} />
                        <Route path="fishes" element={<Fish />} />
                        <Route path="culture-cycle" element={<CultureCycle />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="feed" element={<Feed />} />
                        <Route path="feed-stocks" element={<FeedStock />} />
                        <Route path="feed-management/stock" element={<FeedManagementStock />} />
                        <Route path="feed-management/report" element={<FeedManagementReport />} />
                        <Route path="access/" element={<RolePermissionPage  />}/>
                        <Route path="access/assign-role" element={<AssignRole  />}/>
                    </Route>
                </Routes>
                <nav className="p-4 bg-gray-800 text-white">
                    <Link to="/register" className="mr-4">Register</Link>
                    <Link to="/login">Login</Link>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
