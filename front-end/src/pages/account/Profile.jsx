import React, { useState, useEffect } from 'react';
import { Footer, NavBar, SideBar } from '../../components';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useLogout } from './context/AdminLogout'

const Profile = () => {
    const { ojiiz_user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormDirty, setIsFormDirty] = useState(false);

    const { logout } = useLogout();

    const handleClickLogout = () => {
        logout();
    };

    const [userData, setUserData] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        userName: '',
        companyName: '',
        email: '',
        phoneNumber: ''
    });

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
                toast.error('An error occurred while fetching user data. Please try again later.');
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [ojiiz_user.userName, API_URL]);


    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!userData) {
            toast.error('Something went wrong, user record not found.');
            return;
        }
        if (!isFormDirty) {
            toast.info('No changes to save.');
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/ojiiz/user-profile/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Profile updated successfully.');
                // You can update the local state here if needed
            } else {
                if (data.error === "Username already exists") {
                    toast.error('Username is already in use. Please choose a different one.');
                } else {
                    toast.error(data.error || 'Failed to update profile.');
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
            toast.error('An error occurred while updating profile. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
        setIsFormDirty(true);
    };

    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar />
                <h1>Profile</h1>
            </div>
            {isLoading &&
                <div className="loader"></div>
            }
            <div className="profile-content">
                <SideBar />
                <div className="profile-body">
                    <h2>Profile</h2>
                    {error &&
                        <div className="warning">
                            {error.message}
                        </div>
                    }
                    {userData &&
                        <form onSubmit={handleProfileUpdate}>
                            <div className="row">
                                <div className="col">
                                    <h3>Personal</h3>
                                    <div className="row">
                                        <label htmlFor="firstName">
                                            First Name
                                            <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} />
                                        </label>
                                        <label htmlFor="lastName">
                                            Last Name
                                            <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} />
                                        </label>
                                    </div>
                                    <label htmlFor="userName">
                                        User Name
                                        <input type="text" name="userName" value={userData.userName} onChange={handleChange} disabled />
                                    </label>
                                    <label htmlFor="companyName">
                                        Company Name
                                        <input type="text" name="companyName" value={userData.companyName} onChange={handleChange} style={{ width: '100%' }} disabled />
                                    </label>
                                </div>

                                <div className="col">
                                    <h3>Contact</h3>
                                    <label htmlFor="email">
                                        Email
                                        <input type="text" name="email" value={userData.email} onChange={handleChange} style={{ width: '100%' }} disabled />
                                    </label>
                                    <label htmlFor="phoneNumber">
                                        Phone Number
                                        <input type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} style={{ width: '100%' }} />
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className='profile-btn'
                                disabled={isLoading || !isFormDirty}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>

                        </form>
                    }
                    <h2>Account Setting</h2>
                    <div className="row">
                        <button className="primary-button" onClick={(handleClickLogout)}>Logout</button>
                        <Link to="/deactivate-account">
                            <button className="secondary-button">Deactivate Profile</button>
                        </Link>
                    </div>

                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
};

export default Profile;
