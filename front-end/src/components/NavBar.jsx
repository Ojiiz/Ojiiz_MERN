import React, { useState, useEffect, useRef } from 'react';
import './components.css';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import { ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../pages/account/context/AdminLogout'

const NavBar = ({ home }) => {
    const { ojiiz_user } = useAuthContext();
    const { logout } = useLogout();
    const [showMenu, setShowMenu] = useState(false);
    const [showMenuCat, setShowMenuCat] = useState(false);
    const [showMenuProfile, setShowMenuProfile] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const handleCategoryClick = (category) => {
        navigate('/jobs', { state: { category } });
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleClickLogout = () => {
        logout();
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setDropdownVisible(false);
    }, [location]);

    return (
        <div className='navbar'>
            <Link to={"/"}>
                <img src={logo} alt="logo" />
            </Link>

            {home &&
                <ul className='nav-item'>
                    <Link to={"/"}>
                        <li>Home</li>
                    </Link>
                    <li>Categories <ChevronDown />
                        <div className="dropdown-content">
                            <ul>
                                <div className="row-">
                                    <div className="col">
                                        <li onClick={() => handleCategoryClick('CMS')}>CMS</li>
                                        <li onClick={() => handleCategoryClick('Web development')}>Web development</li>
                                        <li onClick={() => handleCategoryClick('Mobile app development')}>Mobile app development</li>
                                    </div>
                                    <div className="col">
                                        <li onClick={() => handleCategoryClick('Games')}>Games</li>
                                        <li onClick={() => handleCategoryClick('Graphic Designer')}>Graphic Designer</li>
                                        <li onClick={() => handleCategoryClick('Blockchain/NFTs')}>Blockchain/NFTs</li>
                                    </div>
                                    <div className="col">
                                        <li onClick={() => handleCategoryClick('UI/UX Designer')}>UI/UX Designer</li>
                                        <li onClick={() => handleCategoryClick('AI/ML/Computer Vision')}>AI/ML/Computer Vision</li>
                                        <li onClick={() => handleCategoryClick('DevOps/Database')}>DevOps/Database</li>
                                    </div>
                                    <div className="col">
                                        <li onClick={() => handleCategoryClick('Digital Marketing')}>Digital Marketing</li>
                                        <li onClick={() => handleCategoryClick('Content Writing')}>Content Writing</li>
                                        <li onClick={() => handleCategoryClick('Google Ads/SEO')}>Google Ads/SEO</li>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </li>
                    <Link to={"/jobs"}>
                        <li>Jobs</li>
                    </Link>
                </ul>
            }

            <div className="nav-acc" ref={dropdownRef}>

                <div className="profile" onClick={toggleDropdown}>
                    <p>{ojiiz_user && ojiiz_user.userName}</p>
                    <img src={profile} alt="profile" />
                </div>

                {dropdownVisible && (
                    <div className="nav-profile-dropdown">
                        <ul>
                            <Link to={"/profile"} onClick={() => setDropdownVisible(false)}>
                                <li>Profile</li>
                            </Link>
                            <Link to={"/saved-jobs"} onClick={() => setDropdownVisible(false)}>
                                <li>Saved Jobs</li>
                            </Link>
                            <Link to={"/choose-plan"} onClick={() => setDropdownVisible(false)}>
                                <li>Choose Plan</li>
                            </Link>
                            <li onClick={(handleClickLogout)}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>


            <input hidden className="check-icon" id="check-icon" name="check-icon" type="checkbox" onClick={() => setShowMenu(!showMenu)} />
            <label className="icon-menu" htmlFor="check-icon">
                <div className="bar bar--1"></div>
                <div className="bar bar--2"></div>
                <div className="bar bar--3"></div>
            </label>

            {showMenu &&
                <div className="navbar-menu">
                    <ul className='nav-menu-item'>
                        <Link to={"/"}>
                            <li>Home</li>
                        </Link>
                        <li onClick={() => { setShowMenuCat(!showMenuCat); setShowMenuProfile(false) }}>Categories <ChevronDown />
                        </li>

                        {showMenuCat &&
                            <div className="dropdown-menu-content">
                                <ul>
                                    <li onClick={() => handleCategoryClick('CMS')}>CMS</li>
                                    <li onClick={() => handleCategoryClick('Web development')}>Web development</li>
                                    <li onClick={() => handleCategoryClick('Mobile app development')}>Mobile app development</li>
                                    <li onClick={() => handleCategoryClick('Games')}>Games</li>
                                    <li onClick={() => handleCategoryClick('Graphic Designer')}>Graphic Designer</li>
                                    <li onClick={() => handleCategoryClick('Blockchain/NFTs')}>Blockchain/NFTs</li>
                                    <li onClick={() => handleCategoryClick('UI/UX Designer')}>UI/UX Designer</li>
                                    <li onClick={() => handleCategoryClick('AI/ML/Computer Vision')}>AI/ML/Computer Vision</li>
                                    <li onClick={() => handleCategoryClick('DevOps/Database')}>DevOps/Database</li>
                                    <li onClick={() => handleCategoryClick('Digital Marketing')}>Digital Marketing</li>
                                    <li onClick={() => handleCategoryClick('Content Writing')}>Content Writing</li>
                                    <li onClick={() => handleCategoryClick('Google Ads/SEO')}>Google Ads/SEO</li>
                                </ul>
                            </div>
                        }

                        <Link to={"/jobs"}>
                            <li>Jobs</li>
                        </Link>
                        <li onClick={() => { setShowMenuProfile(!showMenuProfile); setShowMenuCat(false) }}>{ojiiz_user && ojiiz_user.userName}<ChevronDown /></li>
                        {showMenuProfile && (
                            <div className="nav-menu-profile-dropdown">
                                <ul>
                                    <Link to={"/profile"} onClick={() => setDropdownVisible(false)}>
                                        <li>Profile</li>
                                    </Link>
                                    <Link to={"/saved-jobs"} onClick={() => setDropdownVisible(false)}>
                                        <li>Saved Jobs</li>
                                    </Link>
                                    <Link to={"/choose-plan"} onClick={() => setDropdownVisible(false)}>
                                        <li>Choose Plan</li>
                                    </Link>
                                    <li onClick={(handleClickLogout)}>Logout</li>
                                </ul>
                            </div>
                        )}
                    </ul>



                </div>
            }

        </div>
    );
};

export default NavBar;
