import React, { useState, useEffect, useMemo } from 'react';
import { Footer, Hero, Jobs, SkeletonPageLoader } from '../components';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import noJob from '../assets/no-job.png'

const JobPages = () => {
    const { ojiiz_user } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const jobSearch = useMemo(() => location.state?.jobs || [], [location.state?.jobs]);
    const category = useMemo(() => location.state?.category || '', [location.state?.category]);
    const searchQuery = useMemo(() => location.state?.searchQuery || '', [location.state?.searchQuery]);

    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [remCredit, setRemCredit] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showMobfilter, setShowMobfilter] = useState(false);

    const [filters, setFilters] = useState({
        jobCategory: category ? [category] : [],
        jobDate: [],
    });

    const [sortBy, setSortBy] = useState('');

    const handleClearFilters = () => {
        setFilters({
            jobCategory: [],
            jobDate: [],
        });
        setSortBy('');
        fetchData()
        navigateToJobsList();
    };

    const fetchData = () => {
        if (jobSearch.length > 0) {
            setJobs(jobSearch);
            setFilters((prevFilters) => ({
                ...prevFilters,
                jobCategory: category ? [category] : [],
            }));
            fetchUserData()
        } else if (category) {
            applyFilters({ ...filters, jobCategory: [category] });
        } else {
            fetchJobs();
        }
    }

    useEffect(() => {
        fetchData()
    }, [jobSearch, category]);

    useEffect(() => {
        if (sortBy) {
            sortJobs(sortBy);
        }
    }, [sortBy]);

    const handleSortChange = (event) => {
        const selectedSortBy = event.target.value;
        setSortBy(selectedSortBy);
    };

    const handleFilterChange = (event) => {
        const { name, value, checked, type } = event.target;

        setFilters((prevFilters) => {
            let updatedFilters;
            if (type === 'checkbox') {
                if (checked) {
                    updatedFilters = {
                        ...prevFilters,
                        [name]: [...prevFilters[name], value],
                    };
                } else {
                    updatedFilters = {
                        ...prevFilters,
                        [name]: prevFilters[name].filter((filter) => filter !== value),
                    };
                }
                applyFilters(updatedFilters);
            }
            return updatedFilters;
        });
    };

    const applyFilters = async (updatedFilters) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/filter-job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFilters),
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
                setCurrentPage(1);
                await fetchUserData();
                // Apply sorting after applying filters
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
            const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/user-profile/${ojiiz_user.userName}`);
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
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
                setCurrentPage(1);
                await fetchUserData();
                // Apply sorting after fetching jobs
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
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPage = (pageNumber) => {
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
            return <img src={noJob} alt="" width={400} />;
        }

        return jobs.slice(startIndex, endIndex).map((job) => (
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
                <form onSubmit={(e) => { e.preventDefault(); applyFilters(e); }}>
                    <div className="filter-header">
                        <h2>Filters</h2>
                        <button type="reset" className="reset" onClick={handleClearFilters}>
                            Clear
                        </button>
                    </div>
                    <div className="horizontal-filter-bar">
                        <div>
                            <p onClick={() => setShowMobfilter(!showMobfilter)}>Categories</p>
                            {showMobfilter &&
                                <div className="checkbox">
                                    <label htmlFor="cms">
                                        <input type="checkbox" name="jobCategory" id="cms" value="CMS" onChange={handleFilterChange} checked={filters.jobCategory.includes('CMS')} />
                                        CMS
                                    </label>
                                    <label htmlFor="web-development">
                                        <input type="checkbox" name="jobCategory" id="web-development" value="Web development" onChange={handleFilterChange} checked={filters.jobCategory.includes('Web development')} />
                                        Web development
                                    </label>
                                    <label htmlFor="mobile-app-development">
                                        <input type="checkbox" name="jobCategory" id="mobile-app-development" value="Mobile app development" onChange={handleFilterChange} checked={filters.jobCategory.includes('Mobile app development')} />
                                        Mobile app development
                                    </label>
                                    <label htmlFor="games">
                                        <input type="checkbox" name="jobCategory" id="games" value="Games" onChange={handleFilterChange} checked={filters.jobCategory.includes('Games')} />
                                        Games
                                    </label>
                                    <label htmlFor="G-D">
                                        <input type="checkbox" name="jobCategory" id="G-D" value="Graphic Designer" onChange={handleFilterChange} checked={filters.jobCategory.includes('Graphic Designer')} />
                                        Graphic Designer
                                    </label>
                                    <label htmlFor="blockchain-nft">
                                        <input type="checkbox" name="jobCategory" id="blockchain-nft" value="Blockchain/NFTs" onChange={handleFilterChange} checked={filters.jobCategory.includes('Blockchain/NFTs')} />
                                        Blockchain/NFTs
                                    </label>
                                    <label htmlFor="UI-UX">
                                        <input type="checkbox" name="jobCategory" id="UI-UX" value="UI/UX Designer" onChange={handleFilterChange} checked={filters.jobCategory.includes('UI/UX Designer')} />
                                        UI/UX Designer
                                    </label>
                                    <label htmlFor="AI">
                                        <input type="checkbox" name="jobCategory" id="AI" value="AI/ML/Computer Vision" onChange={handleFilterChange} checked={filters.jobCategory.includes('AI/ML/Computer Vision')} />
                                        AI/ML/Computer Vision
                                    </label>
                                    <label htmlFor="DevOps">
                                        <input type="checkbox" name="jobCategory" id="DevOps" value="DevOps/Database" onChange={handleFilterChange} checked={filters.jobCategory.includes('DevOps/Database')} />
                                        DevOps/Database
                                    </label>
                                    <label htmlFor="D-M">
                                        <input type="checkbox" name="jobCategory" id="D-M" value="Digital Marketing" onChange={handleFilterChange} checked={filters.jobCategory.includes('Digital Marketing')} />
                                        Digital Marketing
                                    </label>

                                    <label htmlFor="content-writing">
                                        <input type="checkbox" name="jobCategory" id="content-writing" value="Content Writing" onChange={handleFilterChange} checked={filters.jobCategory.includes('Content Writing')} />
                                        Content Writing
                                    </label>
                                    <label htmlFor="google">
                                        <input type="checkbox" name="jobCategory" id="google" value="Google Ads/SEO" onChange={handleFilterChange} checked={filters.jobCategory.includes('Google Ads/SEO')} />
                                        Google Ads/SEO
                                    </label>
                                </div>
                            }
                        </div>
                        <div>
                            <p onClick={() => setShowMobfilter(!showMobfilter)}>Date Posted</p>
                            {showMobfilter &&
                                <div className="checkbox">
                                    <label htmlFor="last24hours">
                                        <input type="checkbox" name="jobDate" id="last24hours" value="last24hours" onChange={handleFilterChange} checked={filters.jobDate.includes('last24hours')} />
                                        Last 24 hours
                                    </label>
                                    <label htmlFor="last3days">
                                        <input type="checkbox" name="jobDate" id="last3days" value="last3days" onChange={handleFilterChange} checked={filters.jobDate.includes('last3days')} />
                                        Last 3 days
                                    </label>
                                    <label htmlFor="last7days">
                                        <input type="checkbox" name="jobDate" id="last7days" value="last7days" onChange={handleFilterChange} checked={filters.jobDate.includes('last7days')} />
                                        Last 7 days
                                    </label>
                                    <label htmlFor="last14days">
                                        <input type="checkbox" name="jobDate" id="last14days" value="last14days" onChange={handleFilterChange} checked={filters.jobDate.includes('last14days')} />
                                        Last 14 days
                                    </label>
                                    <label htmlFor="last30days">
                                        <input type="checkbox" name="jobDate" id="last30days" value="last30days" onChange={handleFilterChange} checked={filters.jobDate.includes('last30days')} />
                                        Last 30 days
                                    </label>
                                </div>
                            }
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
                        <div className="checkbox">
                            <label htmlFor="cms">
                                <input type="checkbox" name="jobCategory" id="cms" value="CMS" onChange={handleFilterChange} checked={filters.jobCategory.includes('CMS')} />
                                CMS
                            </label>
                            <label htmlFor="web-development">
                                <input type="checkbox" name="jobCategory" id="web-development" value="Web development" onChange={handleFilterChange} checked={filters.jobCategory.includes('Web development')} />
                                Web development
                            </label>
                            <label htmlFor="mobile-app-development">
                                <input type="checkbox" name="jobCategory" id="mobile-app-development" value="Mobile app development" onChange={handleFilterChange} checked={filters.jobCategory.includes('Mobile app development')} />
                                Mobile app development
                            </label>
                            <label htmlFor="games">
                                <input type="checkbox" name="jobCategory" id="games" value="Games" onChange={handleFilterChange} checked={filters.jobCategory.includes('Games')} />
                                Games
                            </label>
                            <label htmlFor="G-D">
                                <input type="checkbox" name="jobCategory" id="G-D" value="Graphic Designer" onChange={handleFilterChange} checked={filters.jobCategory.includes('Graphic Designer')} />
                                Graphic Designer
                            </label>
                            <label htmlFor="blockchain-nft">
                                <input type="checkbox" name="jobCategory" id="blockchain-nft" value="Blockchain/NFTs" onChange={handleFilterChange} checked={filters.jobCategory.includes('Blockchain/NFTs')} />
                                Blockchain/NFTs
                            </label>
                            <label htmlFor="UI-UX">
                                <input type="checkbox" name="jobCategory" id="UI-UX" value="UI/UX Designer" onChange={handleFilterChange} checked={filters.jobCategory.includes('UI/UX Designer')} />
                                UI/UX Designer
                            </label>
                            <label htmlFor="AI">
                                <input type="checkbox" name="jobCategory" id="AI" value="AI/ML/Computer Vision" onChange={handleFilterChange} checked={filters.jobCategory.includes('AI/ML/Computer Vision')} />
                                AI/ML/Computer Vision
                            </label>
                            <label htmlFor="DevOps">
                                <input type="checkbox" name="jobCategory" id="DevOps" value="DevOps/Database" onChange={handleFilterChange} checked={filters.jobCategory.includes('DevOps/Database')} />
                                DevOps/Database
                            </label>
                            <label htmlFor="D-M">
                                <input type="checkbox" name="jobCategory" id="D-M" value="Digital Marketing" onChange={handleFilterChange} checked={filters.jobCategory.includes('Digital Marketing')} />
                                Digital Marketing
                            </label>

                            <label htmlFor="content-writing">
                                <input type="checkbox" name="jobCategory" id="content-writing" value="Content Writing" onChange={handleFilterChange} checked={filters.jobCategory.includes('Content Writing')} />
                                Content Writing
                            </label>
                            <label htmlFor="google">
                                <input type="checkbox" name="jobCategory" id="google" value="Google Ads/SEO" onChange={handleFilterChange} checked={filters.jobCategory.includes('Google Ads/SEO')} />
                                Google Ads/SEO
                            </label>
                        </div>
                        <p>Date Posted</p>
                        <div className="checkbox">
                            <label htmlFor="last24hours">
                                <input type="checkbox" name="jobDate" id="last24hours" value="last24hours" onChange={handleFilterChange} checked={filters.jobDate.includes('last24hours')} />
                                Last 24 hours
                            </label>
                            <label htmlFor="last3days">
                                <input type="checkbox" name="jobDate" id="last3days" value="last3days" onChange={handleFilterChange} checked={filters.jobDate.includes('last3days')} />
                                Last 3 days
                            </label>
                            <label htmlFor="last7days">
                                <input type="checkbox" name="jobDate" id="last7days" value="last7days" onChange={handleFilterChange} checked={filters.jobDate.includes('last7days')} />
                                Last 7 days
                            </label>
                            <label htmlFor="last14days">
                                <input type="checkbox" name="jobDate" id="last14days" value="last14days" onChange={handleFilterChange} checked={filters.jobDate.includes('last14days')} />
                                Last 14 days
                            </label>
                            <label htmlFor="last30days">
                                <input type="checkbox" name="jobDate" id="last30days" value="last30days" onChange={handleFilterChange} checked={filters.jobDate.includes('last30days')} />
                                Last 30 days
                            </label>
                        </div>
                        {/* <button type="submit">Apply</button> */}
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
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobPages;
