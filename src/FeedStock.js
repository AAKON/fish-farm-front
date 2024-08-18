import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Required for accessibility reasons

function FeedStock() {
    const [feedStocks, setFeedStocks] = useState([]);
    const [feeds, setFeeds] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        feed_id: '',
        amount: '',
        unit: 'KG',
        price: '',
        remarks: ''
    });

    useEffect(() => {
        const fetchFeedStocks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/feed-stocks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFeedStocks(response.data);
            } catch (error) {
                console.error('Error fetching feed stocks:', error);
            }
        };

        const fetchFeeds = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/feeds`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFeeds(response.data);
            } catch (error) {
                console.error('Error fetching feeds:', error);
            }
        };

        fetchFeedStocks();
        fetchFeeds();
    }, []);

    const openModal = () => {
        setIsEditing(false);
        setFormData({
            feed_id: '',
            amount: '',
            unit: 'KG',
            price: '',
            remarks: ''
        });
        setModalIsOpen(true);
    };

    const openEditModal = (feedStock) => {
        setIsEditing(true);
        setFormData(feedStock);
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
                // Update existing feed stock
                await axios.put(`${process.env.REACT_APP_BASE_URL}/api/feed-stocks/${formData._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Create new feed stock
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/feed-stocks`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            closeModal();
            // Refresh the feed stock list after creating/updating
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/feed-stocks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFeedStocks(response.data);
        } catch (error) {
            console.error('Error saving feed stock:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Feed Stock List</h2>
            <button onClick={openModal} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
                Add Feed Stock
            </button>

            {feedStocks.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Feed Name</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Amount</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Unit</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Price</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Remarks</th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {feedStocks.map((feedStock) => (
                        <tr key={feedStock._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-200">
                                {feedStock.feed_id.name}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">{feedStock.amount}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{feedStock.unit}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{feedStock.price}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{feedStock.remarks}</td>
                            <td className="px-4 py-2 border-b border-gray-200">
                                <button onClick={() => openEditModal(feedStock)} className="text-blue-500 hover:underline">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No feed stocks found.</p>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={isEditing ? 'Edit Feed Stock' : 'Add Feed Stock'}
                className="bg-white p-8 rounded shadow-lg w-3/4 max-w-4xl mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-2xl mb-4">{isEditing ? 'Edit Feed Stock' : 'Add Feed Stock'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Feed</label>
                        <select
                            name="feed_id"
                            value={formData.feed_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        >
                            <option value="">Select Feed</option>
                            {feeds.map(feed => (
                                <option key={feed._id} value={feed._id}>
                                    {feed.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Unit</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        >
                            <option value="KG">KG</option>
                            <option value="GM">GM</option>
                            <option value="Pieces">Pieces</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Remarks</label>
                        <input
                            type="text"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-900 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Update Feed Stock' : 'Add Feed Stock'}
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

export default FeedStock;
