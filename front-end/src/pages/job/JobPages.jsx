import React, { useState, useEffect, useMemo } from 'react';
import { Footer, Hero, Jobs, SkeletonPageLoader } from '../../components';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import noJob from '../../assets/no-job.png';
import { useFilterContext } from '../account/context/FilterContext';
import { categoryFilters, dateFilters } from './Options';
import FilterOptions from './FilterOptions';

const JobPages = () => {
    const { ojiiz_user } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const { filters, setFilters } = useFilterContext();

    const jobSearch = useMemo(() => location.state?.jobs || [], [location.state?.jobs]);
    const category = useMemo(() => location.state?.category || '', [location.state?.category]);
    const searchQuery = useMemo(() => location.state?.searchQuery || '', [location.state?.searchQuery]);

    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [remCredit, setRemCredit] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showMobfilter, setShowMobfilter] = useState(false);
    const [sortBy, setSortBy] = useState('');

    const handleClearFilters = () => {
        setFilters({
            jobCategory: [],
            jobDate: [],
        });
        setSortBy('');
        fetchData();
        navigateToJobsList();
    };

    useEffect(() => {
        fetchData()
    }, [jobSearch, category]);

    useEffect(() => {
        if (sortBy) {
            sortJobs(sortBy);
        }
    }, [sortBy]);

    useEffect(() => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            jobCategory: category ? [category] : [],
        }));
    }, [category, setFilters]);

    const fetchData = () => {
        if (jobSearch.length > 0) {
            setJobs(jobSearch);
            setFilters(prevFilters => ({
                ...prevFilters,
                jobCategory: category ? [category] : [],
            }));
            fetchUserData();
        } else if (category) {
            applyFilters({ ...filters, jobCategory: [category] });
        } else {
            fetchJobs();
        }
    };


    const handleSortChange = event => {
        const selectedSortBy = event.target.value;
        setSortBy(selectedSortBy);
    };

    const handleFilterChange = event => {
        const { name, value, checked } = event.target;
        updateFilters(name, value, checked);
        applyFilters({ ...filters, [name]: checked ? [...filters[name], value] : filters[name].filter(filter => filter !== value) });
    };

    const updateFilters = (name, value, checked) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: checked ? [...prevFilters[name], value] : prevFilters[name].filter(filter => filter !== value),
        }));
    };

    const applyFilters = async updatedFilters => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/filter-job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
                body: JSON.stringify(updatedFilters),
            });
            if (response.ok) {
                const data = await response.json();
                const sortedData = data.sort((a, b) => new Date(b.jobDate) - new Date(a.jobDate));
                setJobs(sortedData);
                setCurrentPage(1);
                await fetchUserData();
                if (sortBy) {
                    sortJobs(sortBy, data);
                }
            } else {
                console.error('Failed to apply filters:', response.statusText);
            }
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`, {
                headers: {
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const rem = data.user.totalCredit - data.user.usedCredit;
                setRemCredit(rem);
            } else {
                console.error('Failed to fetch user data:', response.statusText);
                toast.error('An error occurred while fetching user data. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            toast.error('An error occurred while fetching user data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const filtersQuery = new URLSearchParams({
                category,
                searchQuery,
            }).toString();
            const apiUrl = `${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/latest-job?${filtersQuery}`;
            const response = await fetch(apiUrl, {
                headers: {
                    'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
                setCurrentPage(1);
                await fetchUserData();
                if (sortBy) {
                    sortJobs(sortBy, data);
                }
            } else {
                console.error('Failed to fetch jobs:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToJobsList = () => {
        navigate({
            pathname: '/jobs',
            state: {
                jobs: [],
                category: '',
                searchQuery: '',
            },
        });
    };

    const nextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPage = pageNumber => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(jobs.length / 10);

    const sortJobs = (sortBy, data = jobs) => {
        let sortedJobs = [...data];
        if (sortBy === 'newest') {
            sortedJobs.sort((a, b) => new Date(b.jobDate) - new Date(a.jobDate));
        } else if (sortBy === 'oldest') {
            sortedJobs.sort((a, b) => new Date(a.jobDate) - new Date(b.jobDate));
        }
        setJobs(sortedJobs);
    };

    const renderJobs = () => {
        const startIndex = (currentPage - 1) * 10;
        const endIndex = Math.min(startIndex + 10, jobs.length);

        if (jobs.length === 0 && !isLoading) {
            return <img src={noJob} alt="" width={400} className="no-item" />;
        }

        return jobs.slice(startIndex, endIndex).map(job => (
            <React.Fragment key={job._id}>
                {remCredit <= 0 ? (
                    <div onClick={() => handleJobClick()}>
                        <Jobs job={job} />
                    </div>
                ) : (
                    <Link to={`/jobs-detail/${job._id}`}>
                        <Jobs job={job} />
                    </Link>
                )}
            </React.Fragment>
        ));
    };

    const handleJobClick = () => {
        toast.success("You have no more oz credits.");
        setTimeout(() => {
            navigate("/choose-plan");
        }, 2000);
    };

    const pageButtons = [];

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
        pageButtons.push(
            <button key={i} onClick={() => goToPage(i)} className={currentPage === i ? 'active' : ''}>
                {i}
            </button>
        );
    }

    return (
        <div className="job-page">
            <Hero heading={'Find your relevant jobs today'} searchValue={searchQuery} home={true} />
            {isLoading && <div className="loader"></div>}
            <ToastContainer />

            <div className="job-filter-bar">
                <form onSubmit={e => { e.preventDefault(); applyFilters(e); }}>
                    <div className="filter-header">
                        <h2>Filters</h2>
                        <button type="reset" className="reset" onClick={handleClearFilters}>
                            Clear
                        </button>
                    </div>
                    <div className="horizontal-filter-bar">
                        <div>
                            <p onClick={() => setShowMobfilter(!showMobfilter)}>Categories</p>
                            {showMobfilter && (
                                <FilterOptions
                                    options={categoryFilters}
                                    checkedFilters={filters.jobCategory}
                                    onChange={handleFilterChange}
                                />
                            )}
                        </div>
                        <div>
                            <p onClick={() => setShowMobfilter(!showMobfilter)}>Date Posted</p>
                            {showMobfilter && (
                                <FilterOptions
                                    options={dateFilters}
                                    checkedFilters={filters.jobDate}
                                    onChange={handleFilterChange}
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <div className="jobs-list">
                <div className="job-filter">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(e); }}>
                        <div className="filter-header">
                            <h2>Filters</h2>
                            <button type="reset" className="reset" onClick={handleClearFilters}>
                                Clear
                            </button>
                        </div>
                        <p>Categories</p>

                        <FilterOptions
                            options={categoryFilters}
                            checkedFilters={filters.jobCategory}
                            onChange={handleFilterChange}
                        />

                        <p>Date Posted</p>

                        <FilterOptions
                            options={dateFilters}
                            checkedFilters={filters.jobDate}
                            onChange={handleFilterChange}
                        />
                    </form>
                </div>

                <div className="job-list">
                    <div className="job-list-header">
                        <h2>{jobs.length} {filters.jobCategory.length > 0 ? "Filtered Jobs" : "Latest Jobs"}</h2>
                        <select value={sortBy} onChange={handleSortChange}>
                            <option value="">Sort by</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    {isLoading && jobs.length === 0 ? <SkeletonPageLoader /> : renderJobs()}
                    {!isLoading && jobs.length !== 0 && (
                        <>
                            <div className="pagination">
                                <button onClick={prevPage} disabled={currentPage === 1}>
                                    <FaAngleLeft />
                                </button>
                                {pageButtons}
                                <button onClick={nextPage} disabled={currentPage === totalPages}>
                                    <FaAngleRight />
                                </button>
                            </div>

                            <div className="pagination-info">
                                <p>
                                    Page {currentPage} of {totalPages}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobPages;
