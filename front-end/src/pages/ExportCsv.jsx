import React, { useState, useEffect, useRef } from 'react';
import { NavBar, SideBar, FieldSelectionPopup } from '../components';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";
import { CSVLink } from 'react-csv';
import { MdDelete } from "react-icons/md";
import saveJobImg from '../assets/save-job.png';

const ExportCsv = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFieldPopup, setShowFieldPopup] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [csvHeaders, setCsvHeaders] = useState([]);
    const csvLinkRef = useRef(); // Reference for CSVLink

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
                    if (!jobData.error) {
                        const savedJob = userData.user.savedJobs.find(job => job.job_id === jobId);
                        return {
                            ...jobData,
                            mainCredit: savedJob.mainCredit,
                            phoneCredit: savedJob.phoneCredit
                        };
                    } else {
                        toast.warn(`job is no longer exist.`);
                        // If the job does not exist, delete it from the server and remove it from userData.user.savedJobs
                        await deleteJobFromServer(jobId);
                        const jobIndex = userData.user.savedJobs.findIndex(job => job.job_id === jobId);
                        if (jobIndex !== -1) {
                            userData.user.savedJobs.splice(jobIndex, 1); // Remove the job from savedJobs
                        }
                        return null; // Return null to indicate deletion
                    }
                });

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


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    const currentJobsFiltered = savedJobs.filter(
        job =>
            !job.isDeleted ?
                (job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.companyName?.toLowerCase().includes(searchTerm.toLowerCase())) :
                'Job is Deleted'
    );


    const currentJobs = currentJobsFiltered.slice(indexOfFirstJob, indexOfLastJob);

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

    const allHeaders = [
        { label: "Sr#", key: "srNo" },
        { label: "Job Title", key: "jobTitle" },
        { label: "Company Name", key: "companyName" },
        { label: "Posted By", key: "postedBy" },
        { label: "Email", key: "email" },
        { label: "Linkedin", key: "linkedin" },
        { label: "Company Phone", key: "companyPhone" },
        { label: "Job Date", key: "jobDate" },
        { label: "Job Description", key: "jobDescription" }
    ];

    const htmlToPlainText = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const prepareCsvData = (selectedFields) => {
        const data = selectedJobs.map((job, index) => {
            const jobDate = new Date(job.jobDate);
            const formattedJobDate = jobDate.toISOString().split('T')[0];
            const plainTextJobDescription = htmlToPlainText(job.jobDetail);

            const jobData = {
                srNo: index + 1,
                jobTitle: job.jobTitle,
            };

            if (selectedFields.includes("companyName")) jobData.companyName = job.companyName;
            if (selectedFields.includes("postedBy")) jobData.postedBy = job.mainCredit ? job.postedBy : 'Buy oz to access these Info';
            if (selectedFields.includes("email")) jobData.email = job.mainCredit ? job.email : 'Buy oz to access these Info';
            if (selectedFields.includes("linkedin")) jobData.linkedin = job.mainCredit ? job.linkedin : 'Buy oz to access these Info';
            if (selectedFields.includes("companyPhone")) jobData.companyPhone = job.mainCredit && job.phoneCredit ? job.companyPhone : 'Buy oz to access these Info';
            if (selectedFields.includes("jobDate")) jobData.jobDate = formattedJobDate;
            if (selectedFields.includes("jobDescription")) jobData.jobDescription = plainTextJobDescription;

            return jobData;
        });

        // Set csv headers based on selected fields
        const headers = allHeaders.filter(header => selectedFields.includes(header.key) || header.key === "srNo" || header.key === "jobTitle");
        setCsvHeaders(headers);

        return data;
    };

    const handleExport = (selectedFields) => {
        const data = prepareCsvData(selectedFields);
        setCsvData(data);
        setShowFieldPopup(false);
        setTimeout(() => {
            csvLinkRef.current.link.click(); // Trigger CSV download
        }, 100);
    };

    const handleDeleteJob = async (jobId) => {
        const confirmed = window.confirm('Are you sure you want to delete this job?');
        if (!confirmed) {
            return;
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

                            <button
                                onClick={() => setShowFieldPopup(true)}
                                className="primary-button"
                                disabled={selectedJobs.length === 0}
                            >
                                Export CSV
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
                                            job.isDeleted ? (
                                                <tr key={job._id} className={job.isDeleted ? 'delete-job' : ''}>
                                                    <td>{index + 1}</td>
                                                    <td colSpan="9">This job no longer exists.</td>
                                                </tr>
                                            ) : (
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
                                            )
                                        ))}


                                    </tbody>

                                </table>
                            </div>

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

            {showFieldPopup && (
                <FieldSelectionPopup
                    availableFields={allHeaders}
                    onClose={() => setShowFieldPopup(false)}
                    onExport={handleExport}
                />
            )}

            {csvData.length > 0 && (
                <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={"saved_jobs.csv"}
                    className="primary-button"
                    ref={csvLinkRef} // Attach ref to CSVLink
                    style={{ display: 'none' }}
                >
                    Export CSV
                </CSVLink>
            )}
        </div>
    );
};

export default ExportCsv;
