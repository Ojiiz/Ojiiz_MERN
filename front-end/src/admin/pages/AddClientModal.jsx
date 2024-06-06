import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddClientModal = ({ show, handleClose, handleAddClient, handleEditClient, isEditMode, clientData }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        password: '',
        planType: 'free',
        totalCredit: 0,
    });
    const [changePasswordMode, setChangePasswordMode] = useState(false);

    useEffect(() => {
        if (isEditMode && clientData) {
            setFormData({
                _id: clientData._id,
                firstName: clientData.firstName,
                lastName: clientData.lastName,
                userName: clientData.userName,
                email: clientData.email,
                phoneNumber: clientData.phoneNumber,
                companyName: clientData.companyName,
                planType: clientData.planType,
                totalCredit: clientData.totalCredit,
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                userName: '',
                email: '',
                phoneNumber: '',
                companyName: '',
                password: '',
                planType: 'free',
                totalCredit: 0,
            });
        }
    }, [isEditMode, clientData, show]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await handleEditClient(formData);
            } else {
                await handleAddClient(formData);
            }
            handleClose();
        } catch (error) {
            console.error('Error submitting client form:', error);
            toast.error(`Failed to ${isEditMode ? 'edit' : 'add'} client`);
        }
    };

    const handlePasswordChange = async () => {
        setChangePasswordMode(true);
    };


    return (
        <>
            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{isEditMode ? 'Edit Client' : 'Add Client'}</h2>
                            <button className="close-button" onClick={handleClose}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>User Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {!isEditMode && (
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )}
                                {isEditMode && !changePasswordMode && (
                                    <div className="form-group">
                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={handlePasswordChange}
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                )}
                                {changePasswordMode && (
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Plan Type</label>
                                    <select
                                        className="form-control"
                                        name="planType"
                                        value={formData.planType}
                                        onChange={handleChange}
                                    >
                                        <option value="free">Free</option>
                                        <option value="advanced">Advanced</option>
                                        <option value="ultimate">Ultimate</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Total Credit</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="totalCredit"
                                        value={formData.totalCredit}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="button-group">
                                    <button type="submit" className="primary-button">
                                        {isEditMode ? 'Update Client' : 'Add Client'}
                                    </button>
                                    <button type="button" className="secondary-button" onClick={handleClose}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddClientModal;
