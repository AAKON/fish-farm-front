import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

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

    const closeModal = () => {
        setModalIsOpen(false);
    };

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
                // Update existing farm
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/farm/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Create new farm
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/farm/create`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            closeModal();
            // Refresh the farm list after creating/updating
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
        <div>
            <h2 className="text-2xl font-bold mb-4">Farm List</h2>
            <button onClick={openModal} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
                Add Farm
            </button>

            {farms.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Name</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Location</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Area Size</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Number of Ponds</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Production Capacity</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {farms.map((farm) => (
                        <tr key={farm._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-200">{farm.name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{farm.location}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{farm.area_size}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{farm.number_of_pond}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{farm.production_capacity}</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <button onClick={() => openEditModal(farm)} className="text-blue-500 hover:underline">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No farms found.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Farm' : 'Add Farm'}
                className="bg-white p-8 rounded shadow-lg w-3/4 max-w-4xl mx-auto"  // Adjust width here
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl mb-4">{isEditing ? 'Edit Farm' : 'Add Farm'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Area Size</label>
                        <input
                            type="number"
                            name="area_size"
                            value={formData.area_size}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Number of Ponds</label>
                        <input
                            type="number"
                            name="number_of_pond"
                            value={formData.number_of_pond}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Production Capacity</label>
                        <input
                            type="text"
                            name="production_capacity"
                            value={formData.production_capacity}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Update Farm' : 'Add Farm'}
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default Farm;
