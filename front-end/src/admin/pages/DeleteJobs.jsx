import React, { useState } from 'react';
import { AdminSideBar, AdminTopBar } from '../components';
import { GoAlert } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteJobs = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_BASE_API_URL;

    const handleDeleteJobs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/ojiiz/delete-expired-jobs`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ daysAgo: 30 }) 
            });

            if (response.ok) {
                toast.success('Expired jobs deleted successfully.');
                setTimeout(() => {
                    navigate('/client'); 
                }, 2000);
            } else {
                console.error('Failed to delete jobs:', response.statusText);
                toast.error('Failed to delete jobs');
            }
        } catch (error) {
            console.error('Error deleting jobs:', error);
            toast.error('An error occurred while deleting jobs');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='admin-page'>
            <AdminSideBar />
            <div className="admin-detail">
                <AdminTopBar />
                <ToastContainer />
                <div className="billing-modal">
                    <div className="deactivate-content">
                        <div className="deactivate-body">
                            <div className="icon">
                                <GoAlert size={51} color='white' />
                            </div>
                            <h3>Are you sure you want to delete expired jobs?</h3>
                            <p>Press "Delete jobs" to remove them permanently, or "Cancel" if you want to keep your benefits.</p>
                            <div className="d-acount-btn">
                                <button onClick={handleDeleteJobs} disabled={isLoading}>
                                    {isLoading ? 'Deleting...' : 'Delete jobs'}
                                </button>
                                <Link to={"/client"}>
                                    <button>Cancel</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteJobs;
