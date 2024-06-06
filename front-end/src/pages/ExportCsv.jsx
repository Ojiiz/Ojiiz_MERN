import React, { useState, useEffect } from 'react';
import { NavBar, SideBar } from '../components';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";
import { CSVLink } from 'react-csv';
import { MdDelete } from "react-icons/md";
import saveJobImg from '../assets/save-job.png'

const ExportCsv = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');

    const { ojiiz_user } = useAuthContext();
    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                setIsLoading(true);
                // Fetch user data
                const response = await fetch(`${API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`);
                const userData = await response.json();

                // Get saved jobs from user data
                const savedJobsIds = userData.user.savedJobs.map(savedJob => savedJob.job_id);

                // Fetch job details for each saved job
                const jobsPromises = savedJobsIds.map(async jobId => {
                    const jobResponse = await fetch(`${API_URL}/api/ojiiz/job/${jobId}`);
                    const jobData = await jobResponse.json();

                    // Find the saved job from user data
                    const savedJob = userData.user.savedJobs.find(job => job.job_id === jobId);

                    return {
                        ...jobData,
                        mainCredit: savedJob.mainCredit,
                        phoneCredit: savedJob.phoneCredit
                    };
                });

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

    const currentJobsFiltered = savedJobs.filter(
        job =>
            job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentJobs = currentJobsFiltered.slice(indexOfFirstJob, indexOfLastJob);

    // Handle pagination click
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(currentJobsFiltered.length / jobsPerPage);
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

    const handleCheckboxChange = (job) => {
        setSelectedJobs(prevSelectedJobs => {
            if (prevSelectedJobs.some(selectedJob => selectedJob._id === job._id)) {
                return prevSelectedJobs.filter(selectedJob => selectedJob._id !== job._id);
            } else {
                return [...prevSelectedJobs, job];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedJobs.length === currentJobs.length) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs([...currentJobs]);
        }
    };

    const csvHeaders = [
        { label: "Sr#", key: "srNo" },
        { label: "Job Title", key: "jobTitle" },
        { label: "Company Name", key: "companyName" },
        { label: "Posted By", key: "postedBy" },
        { label: "Email", key: "email" },
        { label: "Linkedin", key: "linkedin" },
        { label: "Company Phone", key: "companyPhone" },
        { label: "Job Date", key: "jobDate" },
        { label: "Job Description", key: "jobDescription" } // Added jobDescription
    ];

    const htmlToPlainText = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const csvData = currentJobs.map((job, index) => {
        // Parse the job date
        const jobDate = new Date(job.jobDate);
        // Format the date to 'YYYY-MM-DD'
        const formattedJobDate = jobDate.toISOString().split('T')[0];

        // Strip HTML tags from job description
        const plainTextJobDescription = htmlToPlainText(job.jobDetail);

        const jobData = {
            srNo: indexOfFirstJob + index + 1,
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            jobDate: formattedJobDate,
            jobDescription: plainTextJobDescription, // Add plain text job description
        };

        if (job.mainCredit) {
            jobData.postedBy = job.postedBy;
            jobData.email = job.email;
            jobData.linkedin = job.linkedin;
        } else {
            jobData.postedBy = 'Buy oz to access these Info';
            jobData.email = 'Buy oz to access these Info';
            jobData.linkedin = 'Buy oz to access these Info';
        }

        if (job.mainCredit && job.phoneCredit) {
            jobData.companyPhone = job.companyPhone;
        } else {
            jobData.companyPhone = 'Buy oz to access these Info';
        }

        return jobData;
    });

    // Function to handle job deletion
    const handleDeleteJob = async (jobId) => {
        const confirmed = window.confirm('Are you sure you want to delete this job?');
        if (!confirmed) {
            return; // Abort deletion if not confirmed
        }

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

            // Update the state to remove the deleted job
            setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
            toast.success('Job deleted successfully');
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Error deleting job:', error.message);
        }
    };

    return (
        <div>
            <div className="jobDetail-navbar">
                <NavBar home={true} />
                <h1>Export CSV</h1>
            </div>
            <ToastContainer />
            {isLoading && <div className="loader"></div>}
            <div className="saved-content">
                <SideBar />
                <div className="export-csv-job">
                    <div className="export-header">
                        <h2>Jobs Data</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button
                                onClick={handleSelectAll}
                                className="secondary-button"
                                style={{ marginRight: '10px' }}
                            >
                                {selectedJobs.length === currentJobs.length ? 'Deselect All' : 'Select All'}
                            </button>

                            <button className="export">
                                {selectedJobs.length > 0 && (
                                    <CSVLink
                                        data={csvData}
                                        headers={csvHeaders}
                                        filename={"saved_jobs.csv"}
                                        className="primary-button"
                                    >
                                        Export CSV
                                    </CSVLink>
                                )}
                            </button>
                        </div>
                    </div>
                    {savedJobs.length > 0 ? (
                        <div>
                            <div className="table-wrapper">
                                <table className='fl-table'>
                                    <thead>
                                        <tr>
                                            <th>Sr#</th>
                                            <th>Job Title</th>
                                            <th>Category</th>
                                            <th>Company Name</th>
                                            <th>Company Phone</th>
                                            <th>Job Date</th>
                                            <th>Actions</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentJobs.map((job, index) => (
                                            <tr key={job._id}>
                                                <td>{indexOfFirstJob + index + 1}</td>
                                                <td>{job.jobTitle}</td>
                                                <td>{job.jobCategory}</td>
                                                <td>{job.mainCredit ? job.companyName : 'Not Available'}</td>
                                                <td>{job.phoneCredit ? job.companyPhone : 'Not Available'}</td>
                                                <td>{job.jobDate.split('T')[0]}</td>
                                                <td>
                                                    <Link to={`/jobs-detail/${job._id}`}><FaEye size={24} className='icon' color='var(--secondary-color)' /></Link>
                                                    <MdDelete size={24} className='icon' color='#fa4444' onClick={() => handleDeleteJob(job._id)} />
                                                </td>
                                                <td>
                                                    <label className="cyberpunk-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            className="cyberpunk-checkbox"
                                                            onChange={() => handleCheckboxChange(job)}
                                                            checked={selectedJobs.some(selectedJob => selectedJob._id === job._id)}
                                                        />
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

                            {/* Pagination */}
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
                        </div>
                    ) : (
                        <img src={saveJobImg} alt="" width={400} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExportCsv;
