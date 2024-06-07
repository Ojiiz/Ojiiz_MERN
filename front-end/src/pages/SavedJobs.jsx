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
                const response = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`);
                const userData = await response.json();
                const savedJobsIds = userData.user.savedJobs.map(savedJob => savedJob.job_id);

                const jobsPromises = savedJobsIds.map(async jobId => {
                    const jobResponse = await fetch(`${API_URL}/api/ojiiz/job/${jobId}`);
                    const jobData = await jobResponse.json();

                    // If the job exists, return it along with the savedJob details
                    if (jobData.error) {

                        toast.warn(`job is no longer exist.`);
                        // If the job does not exist, delete it from the server and remove it from userData.user.savedJobs
                        await deleteJobFromServer(jobId);
                        const jobIndex = userData.user.savedJobs.findIndex(job => job.job_id === jobId);
                        if (jobIndex !== -1) {
                            userData.user.savedJobs.splice(jobIndex, 1); // Remove the job from savedJobs
                        }
                        return null; // Return null to indicate deletion
                    };
                }
                );

                const jobsData = await Promise.all(jobsPromises);

                // Filter out any null values (jobs that were deleted)
                const filteredJobsData = jobsData.filter(job => job !== null);

                // Update state with fetched jobs data
                setSavedJobs(filteredJobsData.map(job => ({
                    ...job,
                    isDeleted: false // Assuming you want to mark non-existing jobs as deleted
                })));

                // No need to update the user profile since we're deleting jobs from the server
            } catch (error) {
                console.error('Error fetching saved jobs:', error);
                toast.error('Error fetching saved jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        async function deleteJobFromServer(jobId) {
            try {
                const response = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}/saved-jobs/${jobId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete job');
                }
            } catch (error) {
                console.error('Error deleting job:', error);
                toast.error('Error deleting job:', error.message);
            }
        }

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
