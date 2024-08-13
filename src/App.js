import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Dashboard from './Dashboard';
import Home from './Home';
import Profile from './Profile';
import Settings from './Settings';
import Reports from './Reports';
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }>
                    <Route path="home" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
                {/* Other routes can be added here */}
            </Routes>
                <div className="App">
                    <nav className="p-4 bg-gray-800 text-white">
                        <Link to="/register" className="mr-4">Register</Link>
                        <Link to="/login">Login</Link>
                    </nav>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
        </Router>
    );
}

export default App;
