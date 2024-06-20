import React, { useState, useEffect } from 'react';
import { Footer, LineChart, NavBar, SideBar } from '../components';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaCoins, FaBuilding } from "react-icons/fa";
import map from '../assets/world-map.png';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { HiDotsVertical } from "react-icons/hi";
import { useAuthContext } from '../hooks/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import saveJobImg from '../assets/save-job.png'

ChartJS.register(ArcElement, Tooltip);

const Overview = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState();
    const [savedJobs, setSavedJobs] = useState([]);
    const { ojiiz_user } = useAuthContext();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch user data to get saved jobs
                const userProfileResponse = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                if (!userProfileResponse.ok) {
                    throw new Error(`Failed to fetch user profile: ${userProfileResponse.statusText}`);
                }
                const userData = await userProfileResponse.json();

                // Get saved jobs IDs and limit to first 4
                const savedJobsIds = userData.user.savedJobs.map(savedJob => savedJob.job_id).slice(0, 4);

                // Fetch job details for each saved job
                const jobsPromises = savedJobsIds.map(jobId =>
                    fetch(`${API_URL}/api/ojiiz/job/${jobId}`,
                        {
                            headers: {
                                'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                            },
                        }).then(response => response.json())
                );

                // Resolve all promises
                const jobsData = await Promise.all(jobsPromises);
                setSavedJobs(jobsData);

                // Set user data
                setUserData(userData.user);
            } catch (error) {
                toast.error("Something went wrong!!");
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

    const truncateText = (content, maxLength) => {
        return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
    };


    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar home={true} />
                <h1>Overview</h1>
            </div>
            {isLoading &&
                <div className="loader"></div>
            }
            <ToastContainer />
            <div className="overview-content">
                <SideBar />
                <div className="overview-detail">
                    <div className="overview-row">
                        <div className="stats-col">

                            <div className="stats">
                                <p>Total Jobs</p>
                                <br />
                                <span>80K+</span>
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
                                <p>Saved Jobs</p>
                                <br />
                                <span>{userData && userData.savedJobs ? userData.savedJobs.length : 0}</span>
                            </div>
                        </div>

                        <div className="country-stats">
                            <div className="country-stats-header">
                                Live Fields
                                <button>By Country</button>
                            </div>
                            <div className="country-stats-body">
                                <img src={map} alt="" />
                            </div>
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

                    <div className="overview-jobs-stats">
                        <div className="job-chart">
                            <LineChart />
                        </div>

                        <div className="saved-jobs">
                            <div className="saved-jobs-header">
                                <p>Saved Jobs</p>
                                <button onClick={() => navigate("/saved-jobs")}>View All</button>
                            </div>

                            <div className="saved-jobs-body">
                                {savedJobs.length > 0 ? savedJobs.map((job) => (
                                    <Link to={`/jobs-detail/${job._id}`} key={job._id}>
                                        <div className="save-job-post">
                                            <div className="building-icon"><FaBuilding /></div>
                                            <p>{job.jobTitle && truncateText(job.jobTitle, 50)}</p>
                                        </div>
                                    </Link>
                                )) :
                                    <img src={saveJobImg} alt="" width={300} className='no-item' />
                                }
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Overview;
