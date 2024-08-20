import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RoleForm({ role }) {
    const [formData, setFormData] = useState({
        name: role ? role.name : ''
    });

    useEffect(() => {
        if (role) {
            setFormData({ name: role.name });
        }
    }, [role]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (role) {
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/access/roles/${role._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/access/roles/create`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            window.location.reload(); // Refresh the page to show updated role list
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl mb-2">{role ? 'Edit Role' : 'Create Role'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">{role ? 'Update Role' : 'Create Role'}</button>
            </form>
        </div>
    );
}

export default RoleForm;
