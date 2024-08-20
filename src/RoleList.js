import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RoleList({ onEditRole, onManagePermissions, onCreateRole }) {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/access/roles/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    return (
        <div>
            <h2 className="text-xl mb-2">Roles</h2>
            <button onClick={onCreateRole} className="btn btn-primary mb-2">Add Role</button>
            <ul className="list-group">
                {roles.map(role => (
                    <li key={role._id} className="list-group-item flex justify-between items-center">
                        {role.name}
                        <div>
                            <button onClick={() => onEditRole(role)} className="btn btn-secondary mr-2">Edit</button>
                            <button onClick={() => onManagePermissions(role)} className="btn btn-info">Permissions</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoleList;
