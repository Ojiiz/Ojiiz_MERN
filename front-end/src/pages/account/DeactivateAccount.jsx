import React from 'react';
import { NavBar, SideBar } from '../../components';
import { GoAlert } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLogout } from '../account/context/AdminLogout';

const DeactivateAccount = () => {
    const { ojiiz_user } = useAuthContext();
    const { logout } = useLogout();

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

        if (!confirmDelete) {
            return; // User cancelled deletion
        }

        try {
            // Make API call to delete the account
            const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/delete-account/${ojiiz_user.userName}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${ojiiz_user.token}`,
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                }
            });

            if (response.ok) {
                // Account deletion successful, log out the user
                toast.success('Your account has been deleted successfully.');
                setTimeout(() => {
                    logout();
                }, 2000);
            } else {
                // Account deletion failed
                toast.error('Failed to delete account. Please try again later.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('An error occurred while deleting your account. Please try again later.');
        }
    };


    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar />
                <h1>Deactivate Account</h1>
            </div>
            <ToastContainer />
            <div className="profile-content">
                <SideBar />
                <div className="billing-modal">
                    <div className="deactivate-content">
                        <div className="deactivate-body">
                            <div className="icon">
                                <GoAlert size={51} color='white' />
                            </div>
                            <h3>Are you sure you want to delete your account permanently?</h3>
                            <p>Press "Delete account" to remove it permanently, or "Cancel" if you want to keep your benefits.</p>
                            <div className="d-acount-btn">
                                <button onClick={handleDeleteAccount}>Delete account</button>
                                <Link to={"/profile"}>
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

export default DeactivateAccount;
