import React, { useState, useEffect } from 'react';
import { AdminSideBar, AdminTopBar } from '../components';
import { MdDelete } from "react-icons/md";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const User = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '' });

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/ojiiz/admin-user`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [API_URL]);

    // Scroll to top when currentPage changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Calculate the users to display on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Handle pagination click
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(users.length / usersPerPage);

    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this User?');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/ojiiz/delete-admin/${userId}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Remove the deleted user from the state
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/ojiiz/admin-signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            const addedUser = await response.json();
            setUsers([...users, addedUser]);
            toast.success('User added successfully');
            handleModalClose();
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Failed to add user');
        }
    };

    return (
        <div className='admin-page'>
            <AdminSideBar />
            <div className="admin-detail">
                <AdminTopBar />
                <ToastContainer />
                {isLoading && <div className="loader"></div>}
                <div className="content">
                    <div className="admin-header">
                        <span>
                            <h3>User</h3>
                            <span>Total Users: <b>{users.length}</b></span>
                        </span>
                        <button className='primary-button' onClick={handleModalOpen}>
                            +Add User
                        </button>
                    </div>

                    <div className="table-wrapper">
                        <table className="fl-table">
                            <thead>
                                <tr>
                                    <th>Sr#</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{indexOfFirstUser + index + 1}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <MdDelete
                                                size={24}
                                                className='icon'
                                                color='#fa4444'
                                                onClick={() => deleteUser(user._id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <span>Page {currentPage} of {totalPages}</span>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Admin</h2>
                            <span className="close-button" onClick={handleModalClose}>&times;</span>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="primary-button">Add User</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
