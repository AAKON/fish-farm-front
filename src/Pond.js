import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');

function Pond() {
    const [ponds, setPonds] = useState([]);
    const [farms, setFarms] = useState([]);
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
                setFarms(response.data);
            } catch (error) {
                console.error('Error fetching farms:', error);
            }
        };

        fetchPonds();
        fetchFarms();
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
            pond_shape: '',
            length: '',
            width: '',
            depth: '',
            circumference: '',
        });
        setModalIsOpen(true);
    };

    const openEditModal = (pond) => {
        setIsEditing(true);

        const pondMeta = pond.pond_meta || {};
        setFormData({
            ...pond,
            farm_id: pond.farm_id._id || pond.farm_id,
            pond_shape: pondMeta.pond_shape || '',
            length: pondMeta.length || '',
            width: pondMeta.width || '',
            depth: pondMeta.depth || '',
            circumference: pondMeta.circumference || ''
        });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => {
            const newState = { ...prevState, [name]: value };

            newState.pond_meta = {
                pond_shape: newState.pond_shape,
            };

            if (newState.pond_shape === 'rectangle') {
                const length = parseFloat(newState.length) || 0;
                const width = parseFloat(newState.width) || 0;
                const depth = parseFloat(newState.depth) || 0;

                newState.pond_size = length * width * depth;
                newState.pond_meta.length = length;
                newState.pond_meta.width = width;
                newState.pond_meta.depth = depth;

            } else if (newState.pond_shape === 'rounded') {
                const circumference = parseFloat(newState.circumference) || 0;
                const depth = parseFloat(newState.depth) || 0;

                const radius = circumference / (2 * Math.PI);
                newState.pond_size = Math.PI * Math.pow(radius, 2) * depth;

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
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/pond/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/pond/create`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            closeModal();
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
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Pond
            </button>

            {ponds.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium">Name</th>
                            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium">Pond Size</th>
                            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium">Pond Type</th>
                            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium">Classification</th>
                            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-gray-50">
                        {ponds.map((pond, index) => (
                            <tr key={pond._id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                <td className="px-4 py-2 border-b border-gray-200">{pond.name}</td>
                                <td className="px-4 py-2 border-b border-gray-200">{pond.pond_size}</td>
                                <td className="px-4 py-2 border-b border-gray-200">{pond.pond_type}</td>
                                <td className="px-4 py-2 border-b border-gray-200">{pond.pond_classification}</td>
                                <td className="px-4 py-2 border-b border-gray-200">
                                    <button onClick={() => openEditModal(pond)} className="text-blue-500 hover:text-blue-700">
                                        <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No ponds found.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Pond' : 'Add Pond'}
                className="bg-white p-8 rounded shadow-lg w-3/4 max-w-4xl mx-auto"
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
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300 ease-in-out"
                        >
                            {isEditing ? 'Update Pond' : 'Add Pond'}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="ml-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Pond;
