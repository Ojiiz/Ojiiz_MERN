import React, { useState } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Hero = ({ heading, home, searchValue }) => {
    const [searchQuery, setSearchQuery] = useState(searchValue || '');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            // Make an API request to fetch jobs based on the search query
            const response = await fetch(`${process.env.REACT_APP_BASE_API_URL}/api/ojiiz/search-job?query=${searchQuery}`,
                {
                    headers: {
                        'x-api-key': process.env.REACT_APP_AUTH_API_KEY,
                    },
                });
            if (response.ok) {
                const data = await response.json();

                // Sort jobs by latest date
                const sortedData = data.sort((a, b) => new Date(b.jobDate) - new Date(a.jobDate));

                navigate('/jobs', { state: { jobs: sortedData, searchQuery: searchQuery } })
            } else {
                toast.error('Something went wrong');
                console.error('Failed to fetch search results:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            toast.error('An error occurred while fetching search results. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <div className='Hero-section'>
            <NavBar home={home} />
            <ToastContainer />
            <div className="hero-content">
                <h1>{home && <span>Welcome <br /></span>}{heading}</h1>
                <p>Thousands of jobs in the computer, engineering and technology sectors are waiting for you.</p>
                <div className="hero-search">
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="search" value={searchQuery} onChange={handleInputChange} placeholder='Search by Category...' />
                        <button type="submit" disabled={isLoading || searchQuery.length === 0}>{isLoading ? 'Searching...' : 'Search Jobs'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Hero;
