import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

function Home() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name', // accessor is the "key" in the data
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
        ],
        []
    );

    const data = useMemo(() => users, [users]);

    const tableInstance = useTable({ columns, data });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Users List</h2>
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps()}
                                className="px-4 py-2 border-b border-gray-200 text-left text-gray-600"
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} className="hover:bg-gray-100">
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    className="px-4 py-2 border-b border-gray-200"
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default Home;
