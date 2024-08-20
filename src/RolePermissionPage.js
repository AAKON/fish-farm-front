import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Import the custom delete modal

Modal.setAppElement('#root');

function RolePermissionManagement() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [formData, setFormData] = useState({ name: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    useEffect(() => {
        const fetchRolesAndPermissions = async () => {
            try {
                const token = localStorage.getItem('token');
                const rolesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/access/roles/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const permissionsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/access/permissions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoles(rolesResponse.data);
                setPermissions(permissionsResponse.data);
            } catch (error) {
                console.error('Error fetching roles and permissions:', error);
            }
        };

        fetchRolesAndPermissions();
    }, []);

    const openModal = () => {
        setIsEditing(false);
        setFormData({ name: '' });
        setSelectedPermissions([]);
        setModalIsOpen(true);
    };

    const openEditModal = (role) => {
        setIsEditing(true);
        setFormData(role);
        setSelectedPermissions(role.permissions.map(permission => permission._id));
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);
    const closeDeleteModal = () => setShowDeleteModal(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        setSelectedPermissions(prev => (checked ? [...prev, value] : prev.filter(id => id !== value)));
    };

    const handleDeleteClick = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (roleToDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/access/roles/${roleToDelete._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoles(roles.filter(role => role._id !== roleToDelete._id));
            } catch (error) {
                console.error('Error deleting role:', error);
            } finally {
                setShowDeleteModal(false);
                setRoleToDelete(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditing) {
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/access/roles/${formData._id}`, { ...formData, permissions: selectedPermissions }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/access/roles/create`, { ...formData, permissions: selectedPermissions }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            closeModal();
            const rolesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/access/roles/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(rolesResponse.data);
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Role Management</h2>
                <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    Add Role
                </button>
            </div>

            {roles.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <tr>
                            <th className="w-1/3 py-2 px-4 text-left text-sm font-medium">Name</th>
                            <th className="w-1/3 py-2 px-4 text-left text-sm font-medium">Permissions</th>
                            <th className="w-1/3 py-2 px-4 text-left text-sm font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-gray-50">
                        {roles.map((role, index) => (
                            <tr key={role._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-200 transition-colors duration-200`}>
                                <td className="py-2 px-4 text-gray-900 font-semibold">{role.name.replace(/_/g, ' ')}</td>
                                <td className="py-2 px-4 text-gray-700">
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.map(permission => (
                                            <span key={permission._id} className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg shadow">
                                                    {permission.name}
                                                </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-2 px-4 flex space-x-2">
                                    <button
                                        onClick={() => openEditModal(role)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(role)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-700">No roles found.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Role' : 'Add Role'}
                className="bg-white p-6 rounded shadow-lg w-11/12 max-w-3xl mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit Role' : 'Add Role'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Role Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Permissions</label>
                        <div className="grid grid-cols-2 gap-2">
                            {permissions.map(permission => (
                                <div key={permission._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        value={permission._id}
                                        checked={selectedPermissions.includes(permission._id)}
                                        onChange={handlePermissionChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-gray-700">{permission.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-4 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isEditing ? 'Update Role' : 'Add Role'}
                        </button>
                    </div>
                </form>
            </Modal>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                roleName={roleToDelete ? roleToDelete.name.replace(/_/g, ' ') : ''}
            />
        </div>
    );
}

export default RolePermissionManagement;
