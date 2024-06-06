import React, { useState } from 'react';
import './account.css';
import { Mail } from 'lucide-react';
import { FaLock } from "react-icons/fa";
import { useLogin } from './context/UseLogin';
import { Link } from 'react-router-dom';

const SignIn = () => {

    const { login, error, isLoading } = useLogin();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call the login function with the input values
        await login(email, password, true);
    };

    return (
        <div className='sign-in'>
            <div className="sign-content">
                <h1>Sign in to your
                    <br />
                    <span> Dream</span>
                </h1>
            </div>

            <div className="sign-fields">
                <h1>SIGN IN</h1>
                <p>Sign in with email address</p>
                <form className='sign-form' onSubmit={handleSubmit}>
                    <div className="input-with-icon">
                        <Mail className="icon" />
                        <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Yourname@gmail.com' />
                    </div>
                    <div className="input-with-icon">
                        <FaLock className="icon" />
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                    </div>
                    <button type="submit" className='primary-btn'>{isLoading ? 'Processing...' : 'Sign In'}</button>
                    <div className="forgot-password">
                        Forgot Password
                    </div>
                    <div className="card-line"></div>
                    <span>Don't have account<Link to={"/sign-up"}> Sign Up</Link></span>
                </form>
                {error && <p className="warning">{error}</p>}
            </div>
            <div className="fade-in"></div>
        </div>
    );
};

export default SignIn;
