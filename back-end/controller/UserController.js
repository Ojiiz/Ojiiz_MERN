const User = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = "whsec_86558f8a3579e55f83fa8cd59adeccf32e2daa660c98a3db5493fbaf36dc4a75";

const createToken = (_id) => {
    return jwt.sign({ _id }, "sjvbsjdhbjavabvhaddabdfjaj", { expiresIn: "2d" });
};

// Function to hash a password
const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

// to check mail and username
const checkUnique = async (req, res) => {
    try {
        const { userName, email } = req.body;
        // Check if username exists
        const existingUsername = await User.findOne({ userName });
        if (existingUsername) {
            return res.json({ unique: false, message: "Username is already in use" });
        }

        // Check if email exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.json({ unique: false, message: "Email is already in use" });
        }

        // If username and email are unique
        res.json({ unique: true });
    } catch (error) {
        console.error("Error checking uniqueness:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


const checkUserName = async (req, res) => {
    const { username } = req.body;


    try {
        // Check if username exists
        const existingUsername = await User.findOne({ userName: username });
        if (!existingUsername) {
            // If username is unique, return empty suggestions array
            return res.json({ suggestions: [] });
        } else {
            // If username exists, generate suggestions
            const suggestions = generateUsernameSuggestions(username);
            return res.json({ suggestions });
        }
    } catch (error) {
        console.error("Error checking username:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const generateUsernameSuggestions = (baseUsername) => {
    const suggestions = [];
    for (let i = 1; i <= 3; i++) {
        suggestions.push(`${baseUsername}${i}`);
    }
    return suggestions;
};

// Function to sign up a user
const signup = async (req, res) => {
    const {
        firstName,
        lastName,
        password,
        userName,
        email,
        phoneNumber,
        companyName,
    } = req.body;
    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            password: hashedPassword,
            userName,
            email,
            phoneNumber,
            companyName,
            planType: 'free',
            totalCredit: 5
        });

        // Save the user to the database
        await user.save();


        res.status(201).json(user);
    } catch (error) {
        let errorMessage = "Failed to create user";

        if (error.code === 11000) {
            // Duplicate key error (unique constraint violation)
            errorMessage = "Username or email is already in use";
            res.status(400).json({ error: errorMessage });
        } else if (error.name === "ValidationError") {
            // Mongoose validation error
            const validationErrors = Object.values(error.errors).map(
                (err) => err.message
            );
            errorMessage = `Validation error: ${validationErrors.join(", ")}`;
            res.status(400).json({ error: errorMessage });
        } else {
            // Other unexpected errors
            res.status(500).json({ error: errorMessage });
        }
    }
};

// Function to log in a user
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        // Check if the user is active
        if (!user.isActive) {
            throw new Error("User is not active. Please contact support.");
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid password");
        }

        // Create and send a JWT token
        const token = createToken(user._id);

        // Send only the required fields in the response
        res.status(200).json({
            token,
            email: user.email,
            userName: user.userName,
            planType: user.planType,
            totalCredit: user.totalCredit,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getUserRecord = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ error: "No Record Found!!!" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching user data" });
    }
};

const getPasswordUpdateRecord = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({ userName }).select('-_id passwordUpdate');
        if (!user || !user.passwordUpdate || user.passwordUpdate.length === 0) {
            return res.status(400).json({ error: "No password update records found for the user" });
        }
        res.status(200).json({ passwordUpdate: user.passwordUpdate });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching password update records" });
    }
};


const getAllUserRecords = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching user data" });
    }
};

const deleteUser = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOneAndDelete({ userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateClientStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
        const client = await User.findById(id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.isActive = isActive;
        await client.save();

        res.json(client);
    } catch (error) {
        console.error('Error updating client status:', error);
        res.status(500).json({ message: 'Failed to update client status' });
    }
};


const updateUser = async (req, res) => {
    const { userId } = req.params;
    const {
        firstName,
        lastName,
        password,
        phoneNumber,
        email,
        companyName,
        planType,
        userName
    } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.firstName = firstName;
        user.lastName = lastName;
        user.userName = userName;
        user.password = password;
        user.phoneNumber = phoneNumber;
        user.email = email;
        user.companyName = companyName;
        user.planType = planType;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        if (error.code === 11000 && error.keyPattern.userName) {
            return res.status(400).json({ error: "Username already exists" });
        }
        res.status(400).json({ error: "Failed to update user data" });
    }
};

// Route to change the user's password
const updatePassword = async (req, res) => {
    const { userName } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid current password" });
        }
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.passwordUpdate = Date.now(); // Update passwordUpdate with the current date
        await user.save();
        res.json({ msg: "Password changed successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const deductCredits = async (req, res) => {
    try {
        const { userName, credit, job_id, type } = req.body;
        // Find the user by userName
        const user = await User.findOne({ userName: userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has enough credits
        if (user.totalCredit < credit) {
            return res.status(400).json({ message: 'Insufficient credit' });
        }

        // Check if the job ID already exists in savedJobs of the current user
        const existingJobIndex = user.savedJobs.findIndex(job => job.job_id === job_id);

        if (existingJobIndex === -1) {
            // If job ID doesn't exist for the current user, add a new entry to savedJobs
            user.savedJobs.push({ job_id: job_id, mainCredit: type === 'main', phoneCredit: type === 'phone', userName: userName });
        } else {
            // If job ID exists for the current user, update mainCredit and phoneCredit
            user.savedJobs[existingJobIndex].mainCredit = true;
            user.savedJobs[existingJobIndex].phoneCredit = true;
        }

        // Deduct credits from the user's record
        user.usedCredit += credit;

        // Save the updated user object
        await user.save();

        res.json({ message: 'Credits deducted successfully' });
    } catch (error) {
        console.error('Error deducting credits:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const saveJob = async (req, res) => {
    try {
        const { userName, jobId } = req.body;

        // Find the user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the job is already saved by the user
        const alreadySaved = user.savedJobs.some(savedJob => savedJob.job_id === jobId);
        if (alreadySaved) {
            return res.status(400).json({ message: 'Job already saved' });
        }
        // If the job is not already saved, add it to the user's saved jobs
        user.savedJobs.push({ job_id: jobId });
        await user.save(); // Save the updated user
        res.status(200).json({ message: 'Job saved successfully' });
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const checkOutSession = async (req, res) => {
    try {
        // Retrieve data from request body
        const formData = req.body;
        // Convert planPrice to cents
        const planPriceInCents = formData.planPrice * 100;

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: formData.planType,
                        },
                        unit_amount: planPriceInCents, // Corrected price format
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CORS_ORIGIN}/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CORS_ORIGIN}/cancel`,
            client_reference_id: formData.userName,
            metadata: {
                selectedPlan: formData.planCredit,
                planType: formData.planType,
            },
        });

        // Send the session ID back to the client
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

const processedSessions = new Set(); // Store processed session IDs


const chooseSession = async (req, res) => {
    try {
        const userData = req.body;

        if (!userData.selectedPlan || !userData._id) {
            return res.status(400).json({ error: 'Missing required user data' });
        }

        let planPriceInCents = 0;

        // Calculate price based on selected plan
        if (userData.selectedPlan < 500) {
            planPriceInCents = userData.selectedPlan * 0.6 * 100;
        } else if (userData.selectedPlan >= 500 && userData.selectedPlan <= 1000) {
            planPriceInCents = userData.selectedPlan * 0.5 * 100;
        } else if (userData.selectedPlan > 1000) {
            planPriceInCents = userData.selectedPlan * 0.45 * 100;
        } else {
            return res.status(400).json({ error: 'Invalid selected plan' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `oz Credits - ${userData.selectedPlan}`,
                        },
                        unit_amount: planPriceInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CORS_ORIGIN}/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CORS_ORIGIN}/cancel`,
            client_reference_id: userData.userName,
            metadata: {
                selectedPlan: userData.selectedPlan,
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};


const retrieveSession = async (req, res) => {
    const sessionId = req.query.session_id;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!processedSessions.has(sessionId)) {
            await updateUserCredit(session);
            processedSessions.add(sessionId);
        }

        res.json(session);
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ error: 'Failed to retrieve session' });
    }
};

const updateUserCredit = async (session) => {
    const sessionId = session.id;

    if (!sessionId) {
        console.error('Session ID not found');
        return;
    }

    // Check if session ID has already been processed
    if (processedSessions.has(sessionId)) {
        console.log(`Session ${sessionId} already processed, skipping.`);
        return;
    }

    try {
        const userId = session.client_reference_id;
        const selectedPlan = parseInt(session.metadata.selectedPlan);
        const planType = session.metadata.planType;

        let user = await User.findOne({ userName: userId });

        if (!user) {
            console.error('User not found');
            return;
        }

        // Update user total credit
        user.totalCredit += selectedPlan;

        // Update plan type if specified
        if (planType) {
            user.planType = planType;
        }

        await user.save();

        // Mark session ID as processed
        processedSessions.add(sessionId);
    } catch (error) {
        console.error('Error updating user credits:', error.message);
    }
};


// for admin
// Function to sign up a user
const addClient = async (req, res) => {
    const {
        firstName,
        lastName,
        password,
        userName,
        email,
        phoneNumber,
        companyName,
        planType,
        totalCredit
    } = req.body;
    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            password: hashedPassword,
            userName,
            email,
            phoneNumber,
            companyName,
            planType: planType,
            totalCredit: totalCredit
        });

        // Save the user to the database
        await user.save();


        res.status(201).json(user);
    } catch (error) {
        let errorMessage = "Failed to create user";

        if (error.code === 11000) {
            // Duplicate key error (unique constraint violation)
            errorMessage = "Username or email is already in use";
            res.status(400).json({ error: errorMessage });
        } else if (error.name === "ValidationError") {
            // Mongoose validation error
            const validationErrors = Object.values(error.errors).map(
                (err) => err.message
            );
            errorMessage = `Validation error: ${validationErrors.join(", ")}`;
            res.status(400).json({ error: errorMessage });
        } else {
            // Other unexpected errors
            res.status(500).json({ error: errorMessage });
        }
    }
};

const updateClient = async (req, res) => {
    const { clientId } = req.params;
    const updateData = req.body;

    // Check if password is being updated
    if (updateData.password) {
        try {
            // Hash the new password
            const hashedPassword = await hashPassword(updateData.password);

            // Replace plain text password with hashed password
            updateData.password = hashedPassword;
        } catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ message: 'Server error, failed to hash password' });
        }
    }

    try {
        // Find the client by ID and update it with the new data
        const updatedClient = await User.findByIdAndUpdate(clientId, updateData, { new: true });

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Server error, failed to update client' });
    }
};

const deleteSavedJob = async (req, res) => {
    try {
        const { userName, jobId } = req.params;

        // Find the user by userName
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the saved job from the user's savedJobs array
        user.savedJobs = user.savedJobs.filter(savedJob => savedJob.job_id.toString() !== jobId);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting saved job:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    signup,
    getAllUserRecords,
    checkUserName,
    deleteUser,
    updateUser,
    getUserRecord,
    updatePassword,
    checkUnique,
    getPasswordUpdateRecord,
    deductCredits,
    saveJob,
    checkOutSession,
    chooseSession,
    retrieveSession,
    updateClientStatus,
    updateClient,
    addClient,
    deleteSavedJob
};
