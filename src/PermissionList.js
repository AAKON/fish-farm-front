import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PermissionList({ role }) {
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);

    useEffect(() => {
        if (role) {
            const fetchPermissions = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const [allPermissionsResponse, roleResponse] = await Promise.all([
                        axios.get(`${process.env.REACT_APP_BASE_URL}/api/access/permissions`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                        axios.get(`${process.env.REACT_APP_BASE_URL}/api/access/roles/${role._id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        }),
                    ]);

                    setPermissions(allPermissionsResponse.data);
                    setRolePermissions(roleResponse.data.permissions.map(perm => perm._id));
                } catch (error) {
                    console.error('Error fetching permissions:', error);
                }
            };

            fetchPermissions();
        }
    }, [role]);

    const handleTogglePermission = async (permissionId) => {
        try {
            const token = localStorage.getItem('token');
            let updatedPermissions;

            if (rolePermissions.includes(permissionId)) {
                // Revoke permission
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/access/roles/revoke-permissions`, {
                    roleId: role._id,
                    permissionsIds: [permissionId],
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                updatedPermissions = rolePermissions.filter(permId => permId !== permissionId);
            } else {
                // Assign permission
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/access/roles/assign-permissions`, {
                    roleId: role._id,
                    permissionsIds: [permissionId],
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                updatedPermissions = [...rolePermissions, permissionId];
            }

            setRolePermissions(updatedPermissions);
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl mb-2">Permissions for {role ? role.name : 'Role'}</h2>
            {role ? (
                <ul className="list-group">
                    {permissions.map(permission => (
                        <li key={permission._id} className="list-group-item flex justify-between items-center">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={rolePermissions.includes(permission._id)}
                                    onChange={() => handleTogglePermission(permission._id)}
                                />
                                {permission.name}
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Select a role to manage permissions.</p>
            )}
        </div>
    );
}

export default PermissionList;
