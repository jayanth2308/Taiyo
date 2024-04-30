import React from 'react';

const ContactDetailsModal = ({ contact, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Contact Details</h2>
        <p><strong>First Name:</strong> {contact.firstname}</p>
        <p><strong>Last Name:</strong> {contact.lastname}</p>
        <p><strong>Status:</strong> {contact.status}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={onClose}>Go Back</button>
      </div>
    </div>
  );
};

export default ContactDetailsModal;
