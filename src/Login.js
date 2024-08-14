import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // useNavigate hook for redirection

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, formData);
            const token = response.data.token;

            // Store the token in localStorage
            localStorage.setItem('token', token);

            // Redirect to the dashboard
            navigate('/dashboard/home');
        } catch (error) {
            setMessage('Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded mt-4 hover:bg-blue-600 transition duration-200">
                        Login
                    </button>
                </form>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
            </div>
        </div>
    );
}

export default Login;
