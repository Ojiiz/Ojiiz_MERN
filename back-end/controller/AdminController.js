const User = require("../model/AdminSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, "sjvbsjdhbjavabvhaddabdfjaj", { expiresIn: "2d" });
};

// Function to hash a password
const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

// Function to sign up a user
const AdminSignup = async (req, res) => {
    const {
        email,
        password,
    } = req.body;
    try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
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
const AdminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
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
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllAdminUserRecords = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching user data" });
    }
};

// Controller function to delete a user by ID
const deleteAdminById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }
        res.json({ message: 'user deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAdminPasswordRecord = async (req, res) => {
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

const AdminupdatePassword = async (req, res) => {
    const { email } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
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
module.exports = {
    AdminLogin,
    AdminSignup,
    getAllAdminUserRecords,
    deleteAdminById,
    getAdminPasswordRecord,
    AdminupdatePassword
}