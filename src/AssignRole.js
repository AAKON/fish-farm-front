import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssignRole() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Prepare role options for the select component
    const options = roles.map(role => ({ value: role._id, label: role.name }));

    // Handle role selection
    const handleChange = (selectedOptions) => {
        setSelectedRoles(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    // Fetch users and roles on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const [usersResponse, rolesResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BASE_URL}/api/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.REACT_APP_BASE_URL}/api/access/roles/all`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setUsers(usersResponse.data);
                setRoles(rolesResponse.data);
            } catch (error) {
                console.error('Error fetching users or roles:', error);
                toast.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/access/assign-role`,
                { userId: selectedUser, roles: selectedRoles },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Roles assigned successfully');
            setSelectedUser('');
            setSelectedRoles([]);
            // Refresh users list after assigning roles
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error assigning roles:', error);
            toast.error('Failed to assign roles');
        }
    };

    return (
        <div className="container mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Assign Role to User</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Select User</label>
                    <div className="relative">
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>Select User</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Assign Roles</label>
                    <div className="relative">
                        <Select
                            isMulti
                            value={options.filter(option => selectedRoles.includes(option.value))}
                            onChange={handleChange}
                            options={options}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select roles..."
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: 'rgba(59, 130, 246, 0.1)', // Light blue on hover
                                    primary: '#3b82f6', // Blue for selected options
                                },
                            })}
                        />
                    </div>
                    <p className="text-gray-500 text-sm mt-2">You can select multiple roles.</p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? 'Assigning...' : 'Assign Roles'}
                    </button>
                </div>
            </form>

            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-4">User Role List</h2>
            {users.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <tr>
                            <th className="w-1/3 py-2 px-4 text-left text-sm font-medium">User</th>
                            <th className="w-1/3 py-2 px-4 text-left text-sm font-medium">Assigned Roles</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-gray-50">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-200 transition-colors duration-200">
                                <td className="py-2 px-4 text-gray-900 font-semibold">{user.name}</td>
                                <td className="py-2 px-4 text-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <span key={role._id}
                                                      className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg shadow">
                                                    {role.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-red-500 text-xs font-semibold">No roles assigned</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-700">No users found.</p>
            )}

            {/* ToastContainer to display alerts */}
            <ToastContainer />
        </div>
    );
}

export default AssignRole;
