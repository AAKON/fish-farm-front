import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';

Modal.setAppElement('#root'); // Required for accessibility reasons

function CultureCycle() {
    const [cultureCycles, setCultureCycles] = useState([]);
    const [ponds, setPonds] = useState([]);
    const [fish, setFish] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        culture_type: '',
        start_date: '',
        ponds: [],
        fish: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [cultureCycleRes, pondsRes, fishRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BASE_URL}/api/culture-cycle/all`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get(`${process.env.REACT_APP_BASE_URL}/api/pond/all`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get(`${process.env.REACT_APP_BASE_URL}/api/fish/all`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);
                setCultureCycles(cultureCycleRes.data);
                setPonds(pondsRes.data);
                setFish(fishRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const openModal = () => {
        setIsEditing(false);
        setFormData({
            name: '',
            culture_type: 'poly',
            start_date: '',
            ponds: [],
            fish: []
        });
        setModalIsOpen(true);
    };

    const openEditModal = (cultureCycle) => {
        setIsEditing(true);
        setFormData({
            ...cultureCycle,
            // Map the ponds to the { value, label } format expected by react-select
            ponds: cultureCycle.ponds.map(pond => pond._id),
            // Map the fish to the { value, label } format expected by react-select
            fish: cultureCycle.fish.map(fish => fish._id),
            // Format the start_date correctly to be used in the input[type="date"]
            start_date: new Date(cultureCycle.start_date).toISOString().substring(0, 10),
        });
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

    const handleChangeCulture = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            'fish': []
        });
    };

    const handleSelectChangePoly = (selectedOptions, name) => {
        setFormData({
            ...formData,
            [name]: formData.culture_type === 'poly'
                ? (selectedOptions ? selectedOptions.map(option => option.value) : [])
                : (selectedOptions ? [selectedOptions.value] : [])
        });
    };

    const handleSelectChange = (selectedOptions, name) => {
        setFormData({
            ...formData,
            [name]: selectedOptions ? selectedOptions.map(option => option.value) : []
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditing) {
                // Update existing culture cycle
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/culture-cycle/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Create new culture cycle
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/culture-cycle/create`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            closeModal();
            // Refresh the culture cycle list after creating/updating
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/culture-cycle/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCultureCycles(response.data);
        } catch (error) {
            console.error('Error saving culture cycle:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Culture Cycle List</h2>
            <button onClick={openModal} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
                Add Culture Cycle
            </button>

            {cultureCycles.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Name</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Culture Type</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Start Date</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Ponds</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Fish</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cultureCycles.map((cultureCycle) => (
                        <tr key={cultureCycle._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-200">{cultureCycle.name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{cultureCycle.culture_type}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{new Date(cultureCycle.start_date).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                {cultureCycle.ponds.length}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                {cultureCycle.fish.length}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <button onClick={() => openEditModal(cultureCycle)} className="text-blue-500 hover:underline">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No culture cycles found.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Culture Cycle' : 'Add Culture Cycle'}
                className="bg-white p-8 rounded shadow-lg w-3/4 max-w-4xl mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl mb-4">{isEditing ? 'Edit Culture Cycle' : 'Add Culture Cycle'}</h2>
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
                        <label className="block text-gray-700 mb-2">Culture Type</label>
                        <select
                            name="culture_type"
                            value={formData.culture_type}
                            onChange={handleChangeCulture}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        >
                            <option value="mono">Mono</option>
                            <option value="poly">Poly</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Ponds</label>
                        <Select
                            isMulti
                            name="ponds"
                            options={ponds.map(pond => ({value: pond._id, label: pond.name}))}
                            className="w-full p-2 border border-gray-900 rounded"
                            value={formData.ponds.map(pondId => {
                                const pond = ponds.find(p => p._id === pondId);
                                return pond ? {value: pond._id, label: pond.name} : null;
                            }).filter(Boolean)}
                            onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'ponds')}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Fish</label>
                        <Select
                            isMulti={formData.culture_type === 'poly'}
                            name="fish"
                            options={fish.map(fishItem => ({value: fishItem._id, label: fishItem.name}))}
                            className="w-full p-2 border border-gray-900 rounded"
                            value={formData.culture_type === 'poly' ? (
                                formData.fish.map(fishId => {
                                    const fishItem = fish.find(f => f._id === fishId);
                                    return fishItem ? {value: fishItem._id, label: fishItem.name} : null;
                                }).filter(Boolean)
                            ) : (
                                formData.fish.length > 0 ? {
                                    value: formData.fish[0],
                                    label: fish.find(f => f._id === formData.fish[0])?.name
                                } : null
                            )}
                            onChange={(selectedOptions) => handleSelectChangePoly(selectedOptions, 'fish')}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Update Culture Cycle' : 'Add Culture Cycle'}
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

export default CultureCycle;
