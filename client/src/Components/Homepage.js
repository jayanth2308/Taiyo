import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactDetailsModal from './ContactDetailsModal';
import { useNavigate } from 'react-router-dom';
import Chartpage from './Chartpage';
import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('contact');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ firstname: '', lastname: '', status: 'active' });
  const [editUserId, setEditUserId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleEdit = (userId) => {
    setEditUserId(userId);
    const userToEdit = data.find(user => user.id === userId);
    setFormData({ firstname: userToEdit.firstname, lastname: userToEdit.lastname, status: userToEdit.status });
    setShowAddForm(true);
  };

  const handleDelete = (userId) => {
    axios.delete(`http://localhost:3001/users/${userId}`)
      .then(() => {
        setData(data.filter(user => user.id !== userId));
      })
      .catch(err => console.log(err));
  };

  const handleAddContact = () => {
    setShowAddForm(true);
    setEditUserId(null);
    setFormData({ firstname: '', lastname: '', status: 'active' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUserId) {
      axios.put(`http://localhost:3001/users/${editUserId}`, formData)
        .then(() => {
          const updatedData = data.map(user => {
            if (user.id === editUserId) {
              return { ...user, firstname: formData.firstname, lastname: formData.lastname, status: formData.status };
            }
            return user;
          });
          setData(updatedData);
          setShowAddForm(false);
          setEditUserId(null);
        })
        .catch(err => console.log(err));
    } else {
      axios.post('http://localhost:3001/users', formData)
        .then(res => {
          setData([...data, res.data]);
          setShowAddForm(false);
        })
        .catch(err => console.log(err));
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditUserId(null);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  return (
    <>
      <Header />
      <div className="flex h-screen mx-2 rounded-2xl">
        <div className="w-1/6 p-2 font-bold h-screen bg-gray-200 text-lg  rounded-2xl">
          <ul>
            <li className={`cursor-pointer py-2 ${selectedTab === 'contact' ? 'bg-gray-400 rounded-2xl' : ''}`} onClick={() => handleTabClick('contact')}>
              <button className='ml-4'>Contact</button>
            </li>
            <li className={`cursor-pointer py-2 ${selectedTab === 'chart' ? 'bg-gray-400 rounded-2xl' : ''}`} onClick={() => handleTabClick('chart')}>
              <button className='ml-4'>Chart</button>
            </li>
          </ul>
        </div>

        <div className="w-5/6 flex flex-col">
          {selectedTab === 'contact' && (
            <div>
              <button className="my-4 mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-6 p-4" onClick={showAddForm ? handleCancel : handleAddContact}>
                {showAddForm ? 'Cancel' : 'Add Contact'}
              </button>
              {showAddForm ? (
                <div className="flex justify-center">
                  <form className="w-96 p-4 bg-white shadow-lg rounded-lg" onSubmit={handleSubmit}>
                    <label className="block mb-2">Firstname</label>
                    <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required className="w-full mb-2 px-3 py-2 border rounded-md" />
                    <label className="block mb-2">Last name</label>
                    <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required className="w-full mb-2 px-3 py-2 border rounded-md" />
                    <label className="block mb-2">Status</label>
                    <div className="mb-2">
                      <input type="radio" id="active" name="status" value="active" checked={formData.status === 'active'} onChange={handleChange} className="mr-2" />
                      <label htmlFor="active">Active</label>
                    </div>
                    <div className="mb-2">
                      <input type="radio" id="inactive" name="status" value="inactive" checked={formData.status === 'inactive'} onChange={handleChange} className="mr-2" />
                      <label htmlFor="inactive">Inactive</label>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">{editUserId ? 'Update' : 'Submit'}</button>
                      <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  {data.length > 0 ? (
                    <div>
                      {data.map(user => (
                        <div key={user.id} className="flex items-center  justify-between border-b border-gray-300 py-2 cursor-pointer hover:bg-gray-200">
                          <div className='flex items-center gap-4 ml-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                            </svg>
                            <div className="w-40 overflow-hidden whitespace-nowrap">{user.firstname} {user.lastname}</div>
                            <p className='font-bold'>status - </p>
                            {user.status}
                          </div>
                          <div className='text-center p-2 flex gap-3 mx-2'>
                            <button onClick={() => handleEdit(user.id)} className='flex cursor-pointer ' style={{ cursor: 'pointer' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(user.id)} className='flex cursor-pointer ' style={{ cursor: 'pointer' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              Delete
                            </button>
                            <button onClick={() => handleViewContact(user)} className='flex cursor-pointer ' style={{ cursor: 'pointer' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                                </svg>
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className='bg-gray-200 rounded-2xl p-4'>No contacts </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {selectedTab === 'chart' && (
            <Chartpage />
          )}
        </div>
      </div>
      {isModalOpen && selectedContact && (
        <ContactDetailsModal contact={selectedContact} onClose={handleCloseModal} />
      )}
      <Footer />
    </>
  );
};

export default HomePage;
