import React, { useState, useEffect } from 'react'
import "./components.css"
import { Link } from 'react-router-dom'
import { useLogout } from '../pages/account/AdminLogout'
import logo from '../../assets/logo.png'
import { FaUser } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LiaBandcamp } from "react-icons/lia";
import { LuLogOut } from "react-icons/lu";

const AdminSideBar = () => {
    const [activeLink, setActiveLink] = useState('');
    const { logout } = useLogout();

    const handleClickLogout = () => {
        logout();
    };

    useEffect(() => {
        const currentPath = window.location.pathname;
        setActiveLink(currentPath);
    }, []);

    return (

        <div className='sidebar'>
            <Link to={"/"}>
                <img src={logo} alt="" />
            </Link>
            <ul>
                <Link to={"/admin"}>
                    <li className={activeLink === '/admin' ? 'active' : ''}><RxDashboard size={20} />Dashboard</li>
                </Link>
                <Link to={"/client"}>
                    <li className={activeLink === '/client' ? 'active' : ''}><HiMiniUserGroup size={20} />Clients</li>
                </Link>
                <Link to={"/admin-jobs"}>
                    <li className={activeLink === '/admin-jobs' ? 'active' : ''}><LiaBandcamp size={20} />Jobs</li>
                </Link>

                <Link to={"/user"}>
                    <li className={activeLink === '/user' ? 'active' : ''}><FaUser size={20} />User</li>
                </Link>

                <li onClick={handleClickLogout}><LuLogOut size={20} />Log Out</li>


            </ul>
        </div>
    )
}

export default AdminSideBar