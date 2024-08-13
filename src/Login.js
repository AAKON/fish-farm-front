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
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
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
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
                    Login
                </button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}

export default Login;
