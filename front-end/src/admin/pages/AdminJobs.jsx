import React, { useState, useEffect } from 'react';
import { AdminSideBar, AdminTopBar } from '../components';
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/ojiiz/all-job`,
                    {
                        headers: {
                            'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                        },
                    });
                const data = await response.json();
                setJobs(data);
                setFilteredJobs(data); // Initialize filteredJobs with all jobs
            } catch (error) {
                console.error('Error fetching client data:', error);
                toast.error('Failed to fetch jobs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [API_URL]);

    // Scroll to top when currentPage changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Calculate the jobs to display on the current page
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    // Handle pagination click
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
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

    // Handle job deletion
    const deleteJob = async (jobId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/ojiiz/delete-job/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete job');
            }

            // Remove the deleted job from the state
            setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
            setFilteredJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
            toast.success('Job deleted successfully');
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Failed to delete job');
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setFilteredJobs(jobs.filter(job =>
            job.jobTitle.toLowerCase().includes(term.toLowerCase()) ||
            job.jobCategory.toLowerCase().includes(term.toLowerCase()) ||
            job.companyName.toLowerCase().includes(term.toLowerCase()) ||
            job.email.toLowerCase().includes(term.toLowerCase())
        ));
        setCurrentPage(1); // Reset to the first page after search
    };

    return (
        <div className='admin-page'>
            <AdminSideBar />
            <div className="admin-detail">
                <AdminTopBar />
                {isLoading && <div className="loader"></div>}
                <div className="content">
                    <div className="admin-header">
                        <span>
                            <h2>Jobs</h2>
                            <span>Total Jobs: <b>{filteredJobs.length}</b></span>
                        </span>
                        <span>Page {currentPage} of {totalPages}</span>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by Title, Category, CompanyName, email..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="table-wrapper">
                        <table className="fl-table">
                            <thead>
                                <tr>
                                    <th>Sr#</th>
                                    <th>Job Title</th>
                                    <th>Job Category</th>
                                    <th>Company Name</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentJobs.map((job, index) => (
                                    <tr key={job._id}>
                                        <td>{indexOfFirstJob + index + 1}</td>
                                        <td>{job.jobTitle}</td>
                                        <td>{job.jobCategory}</td>
                                        <td>{job.companyName}</td>
                                        <td>{job.email}</td>
                                        <td>{job.jobDate.split('T')[0]}</td>
                                        <td>
                                            <MdDelete
                                                size={24}
                                                className='icon'
                                                color='#fa4444'
                                                onClick={() => deleteJob(job._id)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination">
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
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminJobs;
