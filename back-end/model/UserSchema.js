const mongoose = require("mongoose");

// Define schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phoneNumber: {
    type: String,
    required: false,
  },

  companyName: {
    type: String,
  },

  companyPhone: {
    type: String,
  },

  planType: {
    type: String,
    default: 'free',
  },

  totalCredit: {
    type: Number,
    default: 0,
    min: 0
  },

  usedCredit: {
    type: Number,
    default: 0,
    min: 0
  },

  savedJobs: [{
    job_id: {
      type: String,
    },
    mainCredit: {
      type: Boolean,
      default: false
    },
    phoneCredit: {
      type: Boolean,
      default: false
    },
    userName: {
      type: String,
    },
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  passwordUpdate: {
    type: Date,
    default: Date.now,
  },
  // Add other necessary fields here
});

// Create model
const User = mongoose.model("Users", userSchema);

module.exports = User;
