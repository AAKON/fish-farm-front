import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Required for accessibility reasons

function Pond() {
    const [ponds, setPonds] = useState([]);
    const [farms, setFarms] = useState([]); // New state to store farms data
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        farm_id: '',
        pond_size: '',
        pond_meta: {},
        pond_type: '',
        pond_classification: '',
        pond_image: '',
        pond_shape: '',
        length: '',
        width: '',
        depth: '',
        circumference: '',
    });

    useEffect(() => {
        const fetchPonds = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pond/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPonds(response.data);
            } catch (error) {
                console.error('Error fetching ponds:', error);
            }
        };

        const fetchFarms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/farm/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFarms(response.data); // Store the fetched farms
            } catch (error) {
                console.error('Error fetching farms:', error);
            }
        };

        fetchPonds();
        fetchFarms(); // Fetch farms when the component mounts
    }, []);

    const openModal = () => {
        setIsEditing(false);
        setFormData({
            name: '',
            farm_id: '',
            pond_size: '',
            pond_meta: {},
            pond_type: '',
            pond_classification: '',
            pond_image: '',
        });
        setModalIsOpen(true);
    };

    const openEditModal = (pond) => {
        setIsEditing(true);

        // Safely access pond_meta or default to an empty object
        const pondMeta = pond.pond_meta || {};

        const formData = {
            ...pond,
            farm_id: pond.farm_id._id || pond.farm_id, // Ensure farm_id is correctly set for the dropdown
            pond_shape: pondMeta.pond_shape || '',
            length: pondMeta.length || '',
            width: pondMeta.width || '',
            depth: pondMeta.depth || '',
            circumference: pondMeta.circumference || ''
        };

        setFormData(formData);
        setModalIsOpen(true);
    };



    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the formData state
        setFormData(prevState => {
            const newState = { ...prevState, [name]: value };

            // Prepare the pond_meta object
            newState.pond_meta = {
                pond_shape: newState.pond_shape,
            };

            // Calculate the pond size and update pond_meta based on the shape
            if (newState.pond_shape === 'rectangle') {
                const length = parseFloat(newState.length) || 0;
                const width = parseFloat(newState.width) || 0;
                const depth = parseFloat(newState.depth) || 0;

                // Pond size = length * width * depth
                newState.pond_size = length * width * depth;

                // Update pond_meta with rectangular dimensions
                newState.pond_meta.length = length;
                newState.pond_meta.width = width;
                newState.pond_meta.depth = depth;

            } else if (newState.pond_shape === 'rounded') {
                const circumference = parseFloat(newState.circumference) || 0;
                const depth = parseFloat(newState.depth) || 0;

                // Calculate radius from circumference: C = 2 * π * r => r = C / (2 * π)
                const radius = circumference / (2 * Math.PI);

                // Pond size = π * r^2 * depth (volume of a cylinder)
                newState.pond_size = Math.PI * Math.pow(radius, 2) * depth;

                // Update pond_meta with rounded dimensions
                newState.pond_meta.circumference = circumference;
                newState.pond_meta.depth = depth;
            }

            return newState;
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditing) {
                // Update existing pond
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/pond/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Create new pond
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/pond/create`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            closeModal();
            // Refresh the pond list after creating/updating
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pond/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPonds(response.data);
        } catch (error) {
            console.error('Error saving pond:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Pond List</h2>
            <button onClick={openModal} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
                Add Pond
            </button>

            {ponds.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Name</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Pond Size</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Pond Type</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Classification</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ponds.map((pond) => (
                        <tr key={pond._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-200">{pond.name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{pond.pond_size}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{pond.pond_type}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{pond.pond_classification}</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <button onClick={() => openEditModal(pond)} className="text-blue-500 hover:underline">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No ponds found.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Pond' : 'Add Pond'}
                className="bg-white p-8 rounded shadow-lg w-3/4 max-w-4xl mx-auto overflow-y-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl mb-4">{isEditing ? 'Edit Pond' : 'Add Pond'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        {/* Pond Shape and Pond Size in the same row */}
                        <div className="mb-4 flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-gray-700 mb-2">Pond Shape</label>
                                <select
                                    name="pond_shape"
                                    value={formData.pond_shape}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-900 rounded"
                                    required
                                >
                                    <option value="">Select Pond Shape</option>
                                    <option value="rounded">Rounded</option>
                                    <option value="rectangle">Rectangle</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-700 mb-2">Pond Size</label>
                                <input
                                    type="number"
                                    name="pond_size"
                                    value={formData.pond_size}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-900 rounded"
                                    required
                                />
                            </div>
                        </div>

                        {/* Length, Width, Depth in the same row */}
                        {formData.pond_shape === 'rectangle' && (
                            <div className="mb-4 flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-2">Length</label>
                                    <input
                                        type="number"
                                        name="length"
                                        value={formData.length || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-900 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-2">Width</label>
                                    <input
                                        type="number"
                                        name="width"
                                        value={formData.width || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-900 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-2">Depth</label>
                                    <input
                                        type="number"
                                        name="depth"
                                        value={formData.depth || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-900 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Circumference and Depth in the same row */}
                        {formData.pond_shape === 'rounded' && (
                            <div className="mb-4 flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-2">Circumference</label>
                                    <input
                                        type="number"
                                        name="circumference"
                                        value={formData.circumference || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-900 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 mb-2">Depth</label>
                                    <input
                                        type="number"
                                        name="depth"
                                        value={formData.depth || ''}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-900 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Farm</label>
                            <select
                                name="farm_id"
                                value={formData.farm_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-900 rounded"
                                required
                            >
                                <option value="">Select Farm</option>
                                {farms.map(farm => (
                                    <option key={farm._id} value={farm._id}>
                                        {farm.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Pond Type</label>
                            <select
                                name="pond_type"
                                value={formData.pond_type}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-900 rounded"
                                required
                            >
                                <option value="">Select Pond Type</option>
                                <option value="culture">Culture</option>
                                <option value="nursery">Nursery</option>
                                <option value="service">Service</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Pond Classification</label>
                            <select
                                name="pond_classification"
                                value={formData.pond_classification}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-900 rounded"
                                required
                            >
                                <option value="">Select Pond Classification</option>
                                <option value="ordinary">Ordinary</option>
                                <option value="contraction">Contraction</option>
                                <option value="R&D">R&D</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Pond Image URL</label>
                            <input
                                type="text"
                                name="pond_image"
                                value={formData.pond_image}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-900 rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {isEditing ? 'Update Pond' : 'Add Pond'}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>


        </div>
    );
}

export default Pond;
