import React, { useState, useEffect } from 'react';
import { AdminSideBar, AdminTopBar } from '../components';
import AddClientModal from './AddClientModal'; // Adjust path as necessary
import { MdModeEditOutline } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Client = () => {
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/ojiiz/client`);
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error('Error fetching client data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [API_URL]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(clients.length / clientsPerPage);

    const updateClientStatus = async (clientId, isActive) => {
        try {
            const response = await fetch(`${API_URL}/api/ojiiz/update-client-status/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive }),
            });

            if (!response.ok) {
                throw new Error('Failed to update client status');
            }

            setClients((prevClients) =>
                prevClients.map((client) =>
                    client._id === clientId ? { ...client, isActive } : client
                )
            );

            toast.success(`Client status updated successfully`);
        } catch (error) {
            console.error('Error updating client status:', error);
            toast.error('Failed to update client status');
        }
    };

    const handleAddClient = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/api/ojiiz/add-client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add client');
            }

            const newClient = await response.json();
            setClients([...clients, newClient]);
            toast.success('Client added successfully');
        } catch (error) {
            console.error('Error adding client:', error);
            toast.error('Failed to add client');
            throw error;
        }
    };

    const handleEditClient = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/api/ojiiz/update-client/${formData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update client');
            }

            const updatedClient = await response.json();
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client._id === updatedClient._id ? updatedClient : client
                )
            );
            toast.success('Client updated successfully');
        } catch (error) {
            console.error('Error updating client:', error);
            toast.error('Failed to update client');
            throw error;
        }
    };

    const openAddClientModal = () => {
        setIsEditMode(false);
        setCurrentClient(null);
        setShowModal(true);
    };

    const openEditClientModal = (client) => {
        setIsEditMode(true);
        setCurrentClient(client);
        setShowModal(true);
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
                            <h3>Client</h3>
                            <span>Total Clients: <b>{clients.length}</b></span>
                        </span>
                        <button className='primary-button' onClick={openAddClientModal}>
                            +Add Client
                        </button>
                        <AddClientModal
                            show={showModal}
                            handleClose={() => setShowModal(false)}
                            handleAddClient={handleAddClient}
                            handleEditClient={handleEditClient}
                            isEditMode={isEditMode}
                            clientData={currentClient}
                        />
                    </div>

                    <div className="table-wrapper">
                        <table className="fl-table">
                            <thead>
                                <tr>
                                    <th>Sr#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Company Name</th>
                                    <th>Plan Type</th>
                                    <th>Total Credit</th>
                                    <th>Used Credit</th>
                                    <th>Phone Number</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClients.map((client, index) => (
                                    <tr key={client._id} className={!client.isActive ? 'active-row' : ''}>
                                        <td>{indexOfFirstClient + index + 1}</td>
                                        <td>{client.userName}</td>
                                        <td>{client.email}</td>
                                        <td>{client.companyName}</td>
                                        <td>{client.planType}</td>
                                        <td>{client.totalCredit}</td>
                                        <td>{client.usedCredit}</td>
                                        <td>{client.phoneNumber ? client.phoneNumber : 'Not Available'}</td>
                                        <td>{client.createdAt.split('T')[0]}</td>
                                        <td>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={client.isActive}
                                                    onChange={() => updateClientStatus(client._id, !client.isActive)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <MdModeEditOutline
                                                size={24}
                                                color='var(--primary-color)'
                                                className='icon'
                                                onClick={() => openEditClientModal(client)}
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
        </div>
    );
};

export default Client;
