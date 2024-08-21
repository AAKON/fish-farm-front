import React from 'react';
import Modal from 'react-modal';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, roleName }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Delete Confirmation"
            className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md mx-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
            <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete the role <span className="font-bold">{roleName}</span>? This action cannot be undone.</p>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-4 hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
}

export default DeleteConfirmationModal;
