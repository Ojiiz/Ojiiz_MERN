const mongoose = require('mongoose');

// Define the job schema
const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobDetail: {
        type: String,
        required: true
    },
    jobCategory: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    companyPhone: {
        type: String,
        required: true
    },
    linkedin: {
        type: String,
        required: true
    },
    jobDate: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model using the schema
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
