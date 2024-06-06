import React, { useState } from 'react'
import './AdminLogin.css'
import { Link } from 'react-router-dom'
import { useAdminLogin } from './useAdminLogin';
import logo from '../../../assets/logo.png'

const AdminLogin = () => {
    const { login, error, isLoading } = useAdminLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call the login function with the input values
        await login(email, password, true);
    };
    return (
        <div className="login-page">
            <Link to={"/"}>
                <img src={logo} alt="" className='logo' />
            </Link>
            <form onSubmit={handleSubmit}>
                <div className="form">
                    <div className="row">
                        <label htmlFor="user">
                            email
                            <input type="text" id='user' placeholder='example@gmail.com' required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label htmlFor="password">
                            Password
                            <input type="password" id='password' placeholder='******' required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                    </div>


                    <button className="submit" type="submit" disabled={isLoading} >
                        {isLoading ? 'Processing...' : 'Login'}
                    </button>
                </div>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div >
    )
}

export default AdminLogin