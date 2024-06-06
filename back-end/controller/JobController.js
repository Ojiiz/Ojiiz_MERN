const Job = require('../model/JobSchema');

// Controller function to add a new job
const addJob = async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller function to fetch all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchLatestJobs = async (req, res) => {
    try {
        let jobs = [];

        // Fetch jobs for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        jobs = await Job.find({ jobDate: { $gte: today } })
            .sort({ jobDate: -1 })

        // If less than 100 jobs are fetched for today, fetch additional jobs from previous dates
        if (jobs.length < 100) {
            const remainingJobsCount = 100 - jobs.length;
            const previousJobs = await Job.find({ jobDate: { $lt: today } })
                .sort({ jobDate: -1 })
                .limit(remainingJobsCount);
            jobs = jobs.concat(previousJobs);
        }

        // Response with fetched jobs
        res.status(200).json(jobs);
    } catch (error) {
        // Handle errors
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const fetchTodayJobs = async (req, res) => {
    try {
        let jobs = [];

        // Fetch jobs for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        jobs = await Job.find({ jobDate: { $gte: today } })
            .sort({ jobDate: -1 })

        // Response with fetched jobs
        res.status(200).json(jobs);
    } catch (error) {
        // Handle errors
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Controller function to fetch an individual job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const filterJobs = async (req, res) => {
    try {
        const { jobCategory, jobDate } = req.body;

        let query = {};

        if (jobCategory && jobCategory.length > 0) {
            // Create a case-insensitive regex pattern for each category
            const categoryRegexes = jobCategory.map(category => new RegExp(category, 'i'));
            query.jobCategory = { $in: categoryRegexes };
        }

        if (jobDate && jobDate.length > 0) {
            const today = new Date();
            const dateQueries = [];

            jobDate.forEach(dateType => {
                let startDate;

                switch (dateType) {
                    case 'last24hours':
                        startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                        break;
                    case 'last3days':
                        startDate = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
                        break;
                    case 'last7days':
                        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'last14days':
                        startDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
                        break;
                    case 'last30days':
                        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        break;
                }

                if (startDate) {
                    dateQueries.push({ jobDate: { $gte: startDate } });
                }
            });

            // If there are multiple date queries, use $or operator
            if (dateQueries.length > 0) {
                query.$or = dateQueries;
            }
        }

        // If jobDate is not provided, do not filter by date
        if (!(jobDate && jobDate.length > 0)) {
            // If no date filter is provided, do not add any date filter to the query
        }

        const jobs = await Job.find(query);
        res.json(jobs);
    } catch (error) {
        console.error('Error filtering jobs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const searchJobs = async (req, res) => {
    try {
        const { query } = req.query;

        // Perform a case-insensitive search for the keyword in jobTitle and jobDetail fields
        const jobsWithTitleMatch = await Job.find({
            jobTitle: { $regex: new RegExp(query, 'i') }
        });

        const jobsWithDetailMatch = await Job.find({
            _id: { $nin: jobsWithTitleMatch.map(job => job._id) }, // Exclude jobs already found by title
            jobDetail: { $regex: new RegExp(query, 'i') }
        });

        // Concatenate jobs found by title and by detail, ensuring uniqueness
        const sortedJobs = [...jobsWithTitleMatch, ...jobsWithDetailMatch];

        res.json(sortedJobs);
    } catch (error) {
        console.error('Error searching jobs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller function to update a job by ID
const updateJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller function to delete a job by ID
const deleteJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchFeatureJobs = async (req, res) => {
    try {
        // Fetch the latest 4 jobs from the database sorted by date in descending order
        const latestJobs = await Job.find().sort({ jobDate: -1 }).limit(4);

        res.status(200).json(latestJobs);
    } catch (error) {
        console.error('Error fetching latest jobs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addJob,
    getAllJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    fetchLatestJobs,
    filterJobs,
    searchJobs,
    fetchFeatureJobs,
    fetchTodayJobs
};
