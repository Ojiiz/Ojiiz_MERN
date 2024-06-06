import React, { useState, useEffect } from 'react';
import { Footer, Jobs, NavBar, SideBar } from '../components';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import saveJobImg from '../assets/save-job.png'

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(10);

    const { ojiiz_user } = useAuthContext();
    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                setIsLoading(true);
                // Fetch user data
                const response = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`);
                const data = await response.json();

                // Get saved jobs from user data
                const savedJobsIds = data.user.savedJobs.map(savedJob => savedJob.job_id);

                // Fetch job details for each saved job
                const jobsPromises = savedJobsIds.map(jobId =>
                    fetch(`${API_URL}/api/ojiiz/job/${jobId}`)
                        .then(response => response.json())
                );

                // Resolve all promises
                const jobsData = await Promise.all(jobsPromises);
                setSavedJobs(jobsData);
            } catch (error) {
                console.error('Error fetching saved jobs:', error);
                toast.error('Error fetching saved jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedJobs();
    }, [API_URL, ojiiz_user.userName]);

    // Scroll to top when currentPage changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Calculate the jobs to display on the current page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = savedJobs.slice(indexOfFirstJob, indexOfLastJob);

    // Handle pagination click
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(savedJobs.length / jobsPerPage);
    const maxPageButtons = 5;

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxPageButtons + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar home={true} />
                <h1>Saved Jobs</h1>
            </div>
            <ToastContainer />
            {isLoading &&
                <div className="loader"></div>
            }
            <div className="saved-content">
                <SideBar />
                <div style={{ paddingBottom: '50px', width: '100%' }}>
                    <div className="saved-job">
                        {savedJobs.length > 0 ? currentJobs.map(job => (
                            <React.Fragment key={job._id}>
                                <Link to={`/jobs-detail/${job._id}`}>
                                    <Jobs job={job} />
                                </Link>
                            </React.Fragment>
                        )) :
                            <img src={saveJobImg} alt="" width={400} />
                        }
                    </div>

                    {/* Pagination */}
                    {savedJobs.length > 0 &&
                        <div className="pagination">
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            {getPageNumbers().map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={currentPage === number ? 'active' : ''}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    }

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SavedJobs;
