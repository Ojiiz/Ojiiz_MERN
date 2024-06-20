import React, { useState, useEffect, useRef } from 'react'
import { Footer, NavBar, SkeletonLoader } from '../components'
import { CiCalendar, CiBookmark } from "react-icons/ci";
import { GoStack } from "react-icons/go";
import { FaArrowDown, FaPhoneVolume, FaEyeSlash } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { ImLinkedin } from "react-icons/im";
import { IoMailSharp, IoCloseOutline } from "react-icons/io5";
import { useAuthContext } from '../hooks/useAuthContext'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoBookmark } from "react-icons/io5";
import { Link, useNavigate, useParams } from 'react-router-dom';

const JobDetail = () => {
    const { ojiiz_user } = useAuthContext();
    const navigate = useNavigate()
    const { id } = useParams();
    const hiddenSectionRef = useRef(null);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [creditLoading, setCreditLoading] = useState(false);
    const [phoneCredit, setPhoneCredit] = useState(false);
    const [hiddenVisible, setHiddenVisible] = useState(false);
    const [savedJob, setSavedJob] = useState(false);
    const [userData, setUserData] = useState({});
    const [latestJobs, setLatestJobs] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State to manage popup visibility

    const API_URL = process.env.REACT_APP_BASE_API_URL;
    const ZEROBOUNCE_API_KEY = process.env.REACT_APP_ZEROBOUNCE_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setHiddenVisible(false);
                setCreditLoading(false);
                setPhoneCredit(false);
                setSavedJob(false)
                // Fetch job detail
                const responseJobs = await fetch(`${API_URL}/api/ojiiz/job/${id}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                if (responseJobs.ok) {
                    const jobData = await responseJobs.json();
                    setJobs(jobData);
                } else {
                    console.error('Failed to fetch job detail:', responseJobs.statusText);
                }

                // Fetch user data
                const responseUserData = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                if (responseUserData.ok) {
                    const userData = await responseUserData.json();
                    setUserData(userData.user);
                    if (userData.user.savedJobs.find(savedJob => savedJob.job_id === id && savedJob.mainCredit)) {
                        setHiddenVisible(true);
                    }
                    if (userData.user.savedJobs.find(savedJob => savedJob.job_id === id && savedJob.phoneCredit)) {
                        setPhoneCredit(true);
                    }
                    if (userData.user.savedJobs.find(savedJob => savedJob.job_id === id)) {
                        setSavedJob(true);
                    }
                } else {
                    console.error('Failed to fetch user data:', responseUserData.statusText);
                    toast.error('An error occurred while fetching user data. Please try again later.');
                }

                // Fetch latest jobs
                const responseLatestJobs = await fetch(`${API_URL}/api/ojiiz/feature-job`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                if (responseLatestJobs.ok) {
                    const latestJobsData = await responseLatestJobs.json();
                    // Filter out the job with the given id and limit to 4 jobs
                    const filteredJobs = latestJobsData.filter(job => job._id !== id).slice(0, 4);
                    setLatestJobs(filteredJobs);
                } else {
                    console.error('Failed to fetch latest jobs:', responseLatestJobs.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred while fetching data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, ojiiz_user.userName, API_URL]);


    const saveJob = async () => {
        try {
            const response = await fetch(`${API_URL}/api/ojiiz/save-job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
                body: JSON.stringify({ userName: ojiiz_user.userName, jobId: id }),
            });
            if (response.ok) {
                toast.success('Job saved successfully!');
                setSavedJob(true)
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error saving job:', error);
            toast.error('An error occurred while saving job. Please try again later.');
        }
    };

    const scrollToHiddenSection = () => {
        if (window.innerWidth <= 1024) {
            setIsPopupVisible(true); // Show popup on mobile/tablet screens
        } else if (hiddenSectionRef.current) {
            setIsPopupVisible(false)
            hiddenSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const formatDate = (jobDate) => {
        if (!jobDate) return "";
        const date = new Date(jobDate);
        if (isNaN(date.getTime())) {
            return "";
        }
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const renderHTML = (htmlContent) => {
        return { __html: htmlContent };
    };

    const verifyEmail = async (email) => {
        try {
            setCreditLoading(true)
            const response = await fetch(`https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`);

            if (response.ok) {
                const data = await response.json();

                if (data.error === 'Invalid API key or your account ran out of credits') {
                    toast.error('Mail validation is expire.');
                    return 'expire';
                }
                return ['valid', 'do_not_mail', 'catch_all'].includes(data.status);
            } else {
                console.error('Failed to verify email:', response.statusText);
                toast.error('Failed to verify email. Please try again later.');
                return false;
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            toast.error('Error verifying email. Please try again later.');
            return false;
        } finally {
            setCreditLoading(true)
        }
    };

    const deductCredits = async (credit, type) => {
        try {
            if (jobs.companyPhone === 'Not Available' && hiddenVisible) {
                toast.error('Company Phone is Not Available');
                return
            }

            if (type === 'main') {
                const isEmailVerified = await verifyEmail(jobs.email);

                if (!isEmailVerified) {
                    toast.error('Company Email did not valid, your credit will refund');
                    setTimeout(async () => {
                        try {
                            setCreditLoading(true);
                            const response = await fetch(`${API_URL}/api/ojiiz/delete-job/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                                },
                            });

                            if (response.ok) {
                                toast.success('Job deleted successfully!');
                                navigate('/jobs');
                            } else {
                                const data = await response.json();
                                toast.error(data.message);
                                console.error('Failed to delete job:', data.message);
                            }
                        } catch (error) {
                            toast.error('Error deleting job:', error);
                            console.error('Error deleting job:', error);
                        } finally {
                            setCreditLoading(false);
                        }
                    }, 2000);
                    return;
                } else if (isEmailVerified === 'expire') {
                    return
                }
            }

            setCreditLoading(true);

            const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/deduct-credits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
                body: JSON.stringify({ userName: ojiiz_user.userName, credit: credit, job_id: id, type: type }),
            });

            if (response.ok) {
                setHiddenVisible(true);
                if (type === 'phone') {
                    setPhoneCredit(true);
                    toast.success(`${credit} credit is deducted`);
                } else {
                    toast.success(`Job saved successfully!`);
                }
                setSavedJob(true)
            } else if (response.status === 400) {
                const data = await response.json();
                toast.error(data.message);
            } else {
                toast.error('Failed to deduct credits:', response.statusText);
            }
        } catch (error) {
            toast.error('Error deducting credits:', error);
            console.error('Error deducting credits:', error);
        } finally {
            setCreditLoading(false);
        }
    };

    const handleJobClick = () => {
        toast.success("Get Paid version for Job Detail");
        setTimeout(() => {
            navigate("/choose-plan")
        }, 2000);
    };

    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar home={true} />
            </div>
            <ToastContainer />
            {isLoading ? (
                <SkeletonLoader />
            ) : (
                <div className="job-detail">
                    <h2>{jobs.jobTitle}</h2>
                    <div className="job-detail-row">
                        <div className="job-overview">
                            <h3>Job Overview</h3>
                            <div className="overview-row">
                                <div className="job-overview-detail">
                                    <CiCalendar size={32} color='#706BEB' />
                                    <span>Job Posted:</span>
                                    <p>{formatDate(jobs.jobDate)}</p>
                                </div>
                                <div className="vertical-line"></div>
                                <div className="job-overview-detail">
                                    <GoStack size={32} color='#706BEB' />
                                    <span>Category</span>
                                    <p>{jobs.jobCategory}</p>
                                </div>
                            </div>
                        </div>
                        <div className="more-detail">
                            <div className="row">
                                {savedJob ? (
                                    <button className="save-btn saved" onClick={saveJob}><IoBookmark size={24} /></button>
                                ) : (
                                    <button className="save-btn" onClick={saveJob}><CiBookmark size={24} /></button>
                                )}
                                <button className='detail-btn' onClick={scrollToHiddenSection}>
                                    Show more details <FaArrowDown />
                                </button>
                            </div>
                            {!hiddenVisible && <i>it will cost <span>1</span> credit</i>}
                        </div>
                    </div>
                    <div className="job-desc">
                        <div className="job-desc-text">
                            <h3>Job Description</h3>
                            <div dangerouslySetInnerHTML={renderHTML(jobs.jobDetail)} />
                        </div>

                        <div ref={hiddenSectionRef} className="hidden">
                            {!hiddenVisible && (
                                <>
                                    <FaEyeSlash size={107} className='eye-icon' />
                                    <button onClick={() => deductCredits(1, 'main')}>
                                        {creditLoading ? (
                                            <div className="loader-btn "></div>
                                        ) : (
                                            <>
                                                Click to access
                                                <i>it will be cost 1 credit</i>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                            <div className={hiddenVisible ? "job-hidden" : "job-hidden job-hidden-blur"}>
                                <p>Contact Info</p>
                                <h2>{hiddenVisible ? jobs.postedBy : 'Posted By'}</h2>
                                <ul>
                                    <li><FaBuilding size={25} />{hiddenVisible ? jobs.companyName : 'Corporate Systems Inc'}</li>
                                    <li><ImLinkedin size={25} /><a href={hiddenVisible ? jobs.linkedin : '#'} target="_blank" rel="noopener noreferrer">{hiddenVisible ? jobs.linkedin : 'Linkeden'}</a></li>
                                    <li><IoMailSharp size={25} />
                                        <a href={`mailto:${hiddenVisible ? jobs.email : '#'}`}>
                                            {hiddenVisible ? jobs.email : 'demo@gmail.com'}
                                        </a>
                                    </li>
                                    {jobs.companyPhone && hiddenVisible && (
                                        <li>
                                            <FaPhoneVolume size={25} />
                                            {phoneCredit ? (
                                                <a href={`tel:${jobs.companyPhone}`}>{jobs.companyPhone}</a>
                                            ) : (
                                                'Phone Number (cost 1 credit)'
                                            )}
                                            {creditLoading ? (
                                                <div className="loader-btn"></div>
                                            ) : (
                                                !phoneCredit && (
                                                    <FaEyeSlash className='icon' size={25} onClick={() => deductCredits(1, 'phone')} />
                                                )
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {isPopupVisible && (
                            <div className="popup">
                                <button className="popup-close" onClick={() => setIsPopupVisible(false)}><IoCloseOutline size={34} color='white' /></button>
                                <div className="hidden">
                                    {!hiddenVisible && (
                                        <>
                                            <FaEyeSlash size={107} className='eye-icon' />
                                            <button onClick={() => deductCredits(1, 'main')}>
                                                {creditLoading ? (
                                                    <div className="loader-btn "></div>
                                                ) : (
                                                    <>
                                                        Click to access
                                                        <i>it will be cost 1 credit</i>
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}
                                    <div className={hiddenVisible ? "job-hidden" : "job-hidden job-hidden-blur"}>
                                        <p>Contact Info</p>
                                        <h2>{hiddenVisible ? jobs.postedBy : 'Posted By'}</h2>
                                        <ul>
                                            <li><FaBuilding size={25} />{hiddenVisible ? jobs.companyName : 'Corporate Systems Inc'}</li>
                                            <li>
                                                <ImLinkedin size={25} />
                                                <a
                                                    href={hiddenVisible ? jobs.linkedin : '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-block',
                                                        maxWidth: '200px',
                                                        wordWrap: 'break-word'
                                                    }}
                                                >
                                                    {hiddenVisible ? jobs.linkedin : 'LinkedIn'}
                                                </a>
                                            </li>

                                            <li><IoMailSharp size={25} />
                                                <a href={`mailto:${hiddenVisible ? jobs.email : '#'}`}>
                                                    {hiddenVisible ? jobs.email : 'demo@gmail.com'}
                                                </a>
                                            </li>
                                            {jobs.companyPhone && hiddenVisible && (
                                                <li>
                                                    <FaPhoneVolume size={25} />
                                                    {phoneCredit ? (
                                                        <a href={`tel:${jobs.companyPhone}`}>{jobs.companyPhone}</a>
                                                    ) : (
                                                        'Phone Number (cost 1 credit)'
                                                    )}
                                                    {creditLoading ? (
                                                        <div className="loader-btn"></div>
                                                    ) : (
                                                        !phoneCredit && (
                                                            <FaEyeSlash className='icon' size={25} onClick={() => deductCredits(1, 'phone')} />
                                                        )
                                                    )}
                                                </li>
                                            )}

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="more-job-section">
                <h2>Newest Jobs for You</h2>
                <p>Get the fastest application so that your name is above other application</p>
                <div className="more-job-row">
                    {latestJobs.map(job => (
                        <div className="more-job" key={job._id}>
                            <h3>{truncateText(job.jobTitle, 50)}</h3>
                            <p>{extractAndTruncateContent(job.jobDetail, 100)}</p>
                            {userData && userData.totalCredit - userData.usedCredit <= 0 ? (
                                <div onClick={() => handleJobClick()}>
                                    <button>See More</button>
                                </div>
                            ) : (
                                <Link to={`/jobs-detail/${job._id}`}>
                                    <button>See More</button>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

const truncateText = (content, maxLength) => {
    return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
};

// Function to extract and truncate content, skipping headings
const extractAndTruncateContent = (htmlString, maxLength) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    const childNodes = tempElement.childNodes;
    let content = '';

    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeName.toLowerCase().startsWith('h')) {
            continue;
        }
        if (node.textContent.trim()) {
            content += node.textContent.trim() + ' ';
        }
        if (content.length >= maxLength) {
            break;
        }
    }
    return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
};

export default JobDetail;
