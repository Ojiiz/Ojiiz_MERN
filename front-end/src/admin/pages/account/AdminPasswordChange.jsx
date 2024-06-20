import React, { useState, useEffect } from 'react';
import { useAdminAuthContext } from '../../../hooks/useAdminAuthContext'
import { useLogout } from './AdminLogout'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminSideBar, AdminTopBar } from '../../components';

const AdminPasswordChange = () => {
    const [loading, setLoading] = useState(false);
    const { ojiiz_admin } = useAdminAuthContext();

    const { logout } = useLogout();
    const [error, setError] = useState(null);

    const [passwordUpdate, setPasswordUpdate] = useState('');

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/ojiiz/admin-password-date/${ojiiz_admin.userName}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                const data = await response.json();
                setPasswordUpdate(data.passwordUpdate);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
                toast.error('An error occurred while fetching user data. Please try again later.');
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [ojiiz_admin.userName, API_URL]);


    const isPasswordStrong = (password) => {
        // Regular expressions for password strength criteria
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLengthValid = password.length >= 8;

        // Check if all criteria are met
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialCharacters && isLengthValid;
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if the new password and confirm new password match
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error('New password and confirm password do not match.');
            setLoading(false);
            return;
        }

        // Check if the new password is strong
        if (!isPasswordStrong(passwordData.newPassword)) {
            toast.error('Password is not strong enough. It must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/ojiiz/admin-change-password/${ojiiz_admin.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
                body: JSON.stringify(passwordData),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                toast.success('Password changed successfully.');

                setTimeout(() => {
                    logout()
                }, 2000);
            } else {
                toast.error(data.error || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Error changing password:', error.message);
            toast.error('An error occurred while changing the password. Please try again later.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    return (
        <div className='admin-page'>
            <AdminSideBar />
            <div className="admin-detail">
                <AdminTopBar />
                {loading &&
                    <div className="loader"></div>
                }
                <div className="profile-body">
                    <div className="profile-header">
                        <h2>Change Password</h2>
                        {passwordUpdate && (
                            <p>Last updated on {new Date(passwordUpdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                        )}
                    </div>
                    {error &&
                        <div className="warning">
                            {error.message}
                        </div>
                    }
                    <form onSubmit={handlePasswordChange}>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="currentPassword">
                                    Old Password
                                    <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handleChange} placeholder="Enter your old password" style={{ width: '100%' }} required />
                                </label>
                                <label htmlFor="newPassword">
                                    New Password
                                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handleChange} placeholder="Enter your new password" style={{ width: '100%' }} required />
                                </label>
                                <label htmlFor="confirmNewPassword">
                                    Confirm New Password
                                    <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handleChange} placeholder="Confirm your new password" style={{ width: '100%' }} required />
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="profile-btn" disabled={loading}>Submit</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminPasswordChange;
