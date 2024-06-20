import React, { useState, useEffect } from 'react';
import { Footer, Hero, Jobs, SideBar } from '../components';
import './home.css';
import { FaCoins } from "react-icons/fa6";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiDotsVertical } from "react-icons/hi";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useAuthContext } from '../hooks/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, Tooltip);

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState();
    const { ojiiz_user } = useAuthContext();
    const [latestJobs, setLatestJobs] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_BASE_API_URL;

    const apiKey = process.env.REACT_APP_AUTH_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch latest jobs
                const latestJobsResponse = await fetch(`${API_URL}/api/ojiiz/latest-job`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                if (latestJobsResponse.ok) {
                    const latestJobsData = await latestJobsResponse.json();
                    setLatestJobs(latestJobsData);
                } else {
                    console.error('Failed to fetch latest jobs:', latestJobsResponse.statusText);
                }

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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [API_URL, ojiiz_user.userName]);

    const data = {
        labels: ['Remaining Credits', 'Used Credits'],
        datasets: [
            {
                data: [userData ? userData.totalCredit - userData.usedCredit : 0, userData ? userData.usedCredit : 0],
                backgroundColor: ['#7672EC', '#FFC2FD'],
                hoverBackgroundColor: ['#7672EC', '#FFC2FD'],
                borderWidth: 1,
                weight: 1,
            },
        ],
    };

    const options = {};

    const handleJobClick = () => {
        // Display toast message for 2 seconds
        toast.success("You have no more oz credits.");
        setTimeout(() => {
            navigate("/choose-plan");
        }, 2000);
    };

    return (
        <div className='page'>
            <Hero heading={"Find your relevant jobs today"} home={true} />
            {isLoading &&
                <div className="loader"></div>
            }
            <ToastContainer />
            <div className="page-content">
                <SideBar />
                <div className="page-detail">
                    <div className="page-stats">
                        <div className="stats">
                            <p>Saved Jobs</p>
                            <br />
                            <span>{userData && userData.savedJobs ? userData.savedJobs.length : 0}</span>
                        </div>
                        <div className="stats overview-stats">
                            <div className="stats-data">
                                <p>Plan Overview</p>
                                <span>{userData && userData.usedCredit !== undefined ? userData.usedCredit : 0}/{userData && userData.totalCredit !== undefined ? userData.totalCredit : 0}</span>
                            </div>

                            <CircularProgressbar
                                value={userData ? (userData.totalCredit - userData.usedCredit) / userData.totalCredit * 100 : 0}
                                text={userData ? `${Math.round(((userData.totalCredit - userData.usedCredit) / userData.totalCredit) * 100)}%` : '0%'}
                                className='circle-bar'
                                styles={{
                                    path: {
                                        stroke: '#213157',
                                    },
                                    text: {
                                        fill: '#213157',
                                    },
                                }}
                            />
                        </div>
                        <div className="stats">
                            <p>Today jobs</p>
                            <br />
                            <span>{latestJobs.length}</span>
                        </div>
                    </div>

                    <div className="feature-jobs">

                        <div className="feature-job" style={{ width: '650px' }}>
                            <h1>Latest Jobs</h1>
                            {latestJobs.slice(0, 4).map(job => (
                                <React.Fragment key={job._id}>
                                    {userData && userData.totalCredit - userData.usedCredit <= 0 ? (
                                        <div onClick={() => handleJobClick()}>
                                            <Jobs job={job} />
                                        </div>
                                    ) : (
                                        <Link to={`/jobs-detail/${job._id}`}>
                                            <Jobs job={job} />
                                        </Link>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="creds-stats">
                            <div className="creds-header">
                                Credit Info
                                <div className="tooltip-container">
                                    <Link to={"/choose-plan"}>
                                        <HiDotsVertical className='icon' />
                                        <span className="tooltip-text">Buy oz</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="creds-body">
                                <div className="doughnut-chart">
                                    <Doughnut data={data} options={options} />
                                </div>
                                <div className="creds-details">
                                    <div className="creds-color">
                                        <div className="color-name">
                                            <span></span>
                                            <h4>Remaining Credits</h4>
                                        </div>
                                        <div className='cred-value'>
                                            <FaCoins color='#7672EC' />
                                            {userData ? `${userData.totalCredit - userData.usedCredit}/${userData.totalCredit}` : '0/0'}
                                        </div>
                                    </div>
                                    <div className="creds-color">
                                        <div className="color-name">
                                            <span style={{ backgroundColor: '#FFC2FD' }}></span>
                                            <h4>Used Credits</h4>
                                        </div>
                                        <div className='cred-value'>
                                            <FaCoins color='#7672EC' />
                                            {userData ? `${userData.usedCredit}/${userData.totalCredit}` : '0/0'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
