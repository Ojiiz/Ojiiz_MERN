import React, { useState, useEffect } from 'react';
import { FaGlobe, FaUserTie, FaAlignCenter, FaLock, FaPowerOff, FaFileExport } from "react-icons/fa6";
import { LuAlertCircle } from "react-icons/lu";
import rocket from '../assets/rocket.png';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../pages/account/context/AdminLogout'
import { IoBookmark } from "react-icons/io5";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../hooks/useAuthContext';

const SideBar = () => {
    const [userData, setUserData] = useState();
    const { ojiiz_user } = useAuthContext();
    const location = useLocation();

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {

                // Fetch user data
                const userProfileResponse = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                if (userProfileResponse.ok) {
                    const userData = await userProfileResponse.json();
                    setUserData(userData.user);
                } else {
                    console.error('Failed to fetch user profile:', userProfileResponse.statusText);
                }
            } catch (error) {
                toast.error("Something Went wrong!!");
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [API_URL, ojiiz_user.userName]);

    return (
        <div>
            <div className="side-bar">
                <ul>
                    <Link to="/overview">
                        <li className={location.pathname === '/overview' ? 'active' : ''}><FaGlobe size={24} />Overview</li>
                    </Link>
                    <Link to="/profile">
                        <li className={location.pathname === '/profile' ? 'active' : ''}><FaUserTie size={24} />Profile</li>
                    </Link>
                    <Link to="/choose-plan">
                        <li className={location.pathname === '/choose-plan' ? 'active' : ''}><FaAlignCenter size={24} />Buy oz</li>
                    </Link>
                    <Link to="/password-change">
                        <li className={location.pathname === '/password-change' ? 'active' : ''}><FaLock size={24} />Password & Security</li>
                    </Link>

                    <Link to="/export-csv">
                        <li className={location.pathname === '/export-csv' ? 'active' : ''}><FaFileExport size={24} />Export to Csv</li>
                    </Link>

                    <Link to="/saved-jobs">
                        <li className={location.pathname === '/saved-jobs' ? 'active' : ''}><IoBookmark size={24} />Saved Jobs</li>
                    </Link>

                </ul>
                <div className="update">
                    <img src={rocket} alt="" />
                    <div className="update-content">
                        <p>Credit left: {userData ? `${userData.totalCredit - userData.usedCredit}` : '0'} oz</p>
                        <Link to={"/choose-plan"}>
                            <button>Update Now</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bottom-side-bar">
                <ul>
                    <Link to="/overview">
                        <li className={location.pathname === '/overview' ? 'active' : ''}><FaGlobe size={24} /></li>
                    </Link>
                    <Link to="/profile">
                        <li className={location.pathname === '/profile' ? 'active' : ''}><FaUserTie size={24} /></li>
                    </Link>
                    <Link to="/choose-plan">
                        <li className={location.pathname === '/choose-plan' ? 'active' : ''}><FaAlignCenter size={24} /></li>
                    </Link>
                    <Link to="/password-change">
                        <li className={location.pathname === '/password-change' ? 'active' : ''}><FaLock size={24} /></li>
                    </Link>

                    <Link to="/export-csv">
                        <li className={location.pathname === '/export-csv' ? 'active' : ''}><FaFileExport size={24} /></li>
                    </Link>


                    <Link to="/saved-jobs">
                        <li className={location.pathname === '/saved-jobs' ? 'active' : ''}><IoBookmark size={24} /></li>
                    </Link>

                </ul>
            </div>
        </div>

    );
}

export default SideBar;
