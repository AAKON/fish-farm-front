import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Required for accessibility reasons

function Fish() {
    const [fishes, setFishes] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        scientific_name: ''
    });

    useEffect(() => {
        const fetchFishes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/fish/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFishes(response.data);
            } catch (error) {
                console.error('Error fetching fishes:', error);
            }
        };

        fetchFishes();
    }, []);

    const openModal = () => {
        setIsEditing(false);
        setFormData({
            name: '',
            scientific_name: ''
        });
        setModalIsOpen(true);
    };

    const openEditModal = (fish) => {
        setIsEditing(true);
        setFormData(fish);
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
                // Update existing fish
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/fish/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Create new fish
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/fish/create`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            closeModal();
            // Refresh the fish list after creating/updating
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/fish/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFishes(response.data);
        } catch (error) {
            console.error('Error saving fish:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Fish List</h2>
            <button onClick={openModal} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
                Add Fish
            </button>

            {fishes.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Name</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Scientific Name</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fishes.map((fish) => (
                        <tr key={fish._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-200">{fish.name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{fish.scientific_name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <button onClick={() => openEditModal(fish)} className="text-blue-500 hover:underline">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No fishes found.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Fish' : 'Add Fish'}
                className="bg-white p-8 rounded shadow-lg w-3/4 max-w-4xl mx-auto"  // Adjust width here
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl mb-4">{isEditing ? 'Edit Fish' : 'Add Fish'}</h2>
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
                        <label className="block text-gray-700 mb-2">Scientific Name</label>
                        <input
                            type="text"
                            name="scientific_name"
                            value={formData.scientific_name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Update Fish' : 'Add Fish'}
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

export default Fish;
