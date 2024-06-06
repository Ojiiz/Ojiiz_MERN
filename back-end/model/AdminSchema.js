const mongoose = require('mongoose');

// Define the job schema
const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    passwordUpdate: {
        type: Date,
        default: Date.now,
    },
});

// Create a model using the schema
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
