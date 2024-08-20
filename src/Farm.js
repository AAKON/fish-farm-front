import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

Modal.setAppElement('#root'); // Required for accessibility reasons

function Farm() {
    const [farms, setFarms] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        area_size: '',
        number_of_pond: '',
        production_capacity: ''
    });

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/farm/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFarms(response.data);
            } catch (error) {
                console.error('Error fetching farms:', error);
            }
        };

        fetchFarms();
    }, []);

    const openModal = () => {
        setIsEditing(false);
        setFormData({
            name: '',
            location: '',
            area_size: '',
            number_of_pond: '',
            production_capacity: ''
        });
        setModalIsOpen(true);
    };

    const openEditModal = (farm) => {
        setIsEditing(true);
        setFormData(farm);
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditing) {
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/farm/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/farm/create`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            closeModal();
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/farm/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFarms(response.data);
        } catch (error) {
            console.error('Error saving farm:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Farm Management</h2>
            <button
                onClick={openModal}
                className="mb-6 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:from-green-500 hover:to-blue-500 transition ease-in-out duration-300"
            >
                Add Farm
            </button>

            {farms.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-lg rounded-lg">
                        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Location</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Area Size</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Number of Ponds</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Production Capacity</th>
                            <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {farms.map((farm) => (
                            <tr key={farm._id} className="hover:bg-gray-100">
                                <td className="py-4 px-6 text-gray-800 font-medium">{farm.name}</td>
                                <td className="py-4 px-6 text-gray-800">{farm.location}</td>
                                <td className="py-4 px-6 text-gray-800">{farm.area_size}</td>
                                <td className="py-4 px-6 text-gray-800">{farm.number_of_pond}</td>
                                <td className="py-4 px-6 text-gray-800">{farm.production_capacity}</td>
                                <td className="px-4 py-2 border-b border-gray-200">
                                    <button
                                        onClick={() => openEditModal(farm)}
                                        className="flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-500 hover:to-teal-400 transform hover:scale-105 transition-transform duration-300 ease-in-out"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600 mt-6">No farms found. Start by adding a new farm.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Farm' : 'Add Farm'}
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit Farm' : 'Add Farm'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Area Size</label>
                        <input
                            type="number"
                            name="area_size"
                            value={formData.area_size}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Number of Ponds</label>
                        <input
                            type="number"
                            name="number_of_pond"
                            value={formData.number_of_pond}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Production Capacity</label>
                        <input
                            type="text"
                            name="production_capacity"
                            value={formData.production_capacity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ease-in-out duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-500 transition ease-in-out duration-200"
                        >
                            {isEditing ? 'Update Farm' : 'Add Farm'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Farm;
