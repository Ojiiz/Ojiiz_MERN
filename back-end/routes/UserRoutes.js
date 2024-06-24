const express = require("express");
// for user acc
const { login,
    signup,
    getAllUserRecords,
    checkUnique,
    getUserRecord,
    updateUser,
    updatePassword,
    deleteUser,
    getPasswordUpdateRecord,
    deductCredits,
    saveJob,
    checkOutSession,
    chooseSession,
    retrieveSession,
    updateClientStatus,
    updateClient,
    addClient,
    checkUserName,
    deleteSavedJob,

} = require("../controller/UserController");

// for jobs
const {
    addJob,
    getAllJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    fetchLatestJobs,
    filterJobs,
    searchJobs,
    fetchFeatureJobs,
    fetchTodayJobs,
    deleteExpireJobs
} = require('../controller/JobController');

const {
    AdminLogin,
    AdminSignup,
    getAllAdminUserRecords,
    deleteAdminById,
    getAdminPasswordRecord,
    AdminupdatePassword,
} = require("../controller/AdminController");

const router = express.Router();


// user-acount-routes
router.post("/user-login", login);
router.post("/user-signup", signup);


// to check email and username
router.post("/check-unique", checkUnique);
router.get("/user-profile/:userName", getUserRecord);
router.get("/client", getAllUserRecords);
router.put("/user-profile/:userId", updateUser);
router.post('/check-username', checkUserName)

router.put('/update-client-status/:id', updateClientStatus);
// to change password
router.put("/change-password/:userName", updatePassword);

router.delete("/delete-account/:userName", deleteUser);

router.get("/password-date/:userName", getPasswordUpdateRecord);

router.get("/all-user", getAllUserRecords);


// for jobs
router.post('/job', addJob);
router.get('/latest-job', fetchLatestJobs);
router.get('/all-job', getAllJobs);
router.get('/feature-job', fetchFeatureJobs);
router.get('/today-job', fetchTodayJobs);
router.get('/search-job', searchJobs);
router.get('/job/:id', getJobById);

router.post('/filter-job', filterJobs);

router.get('/job', getAllJobs);
router.put('/job/:id', updateJobById);
router.delete('/delete-job/:id', deleteJobById);

// delete 30 days ago jobs
router.delete('/delete-expired-jobs', deleteExpireJobs)

// user credits
router.post('/deduct-credits', deductCredits);
router.post('/save-job', saveJob);
router.post('/create-checkout-session', checkOutSession);
router.post('/choose-session', chooseSession);
router.get('/retrieve-session', retrieveSession);
router.delete('/user-profile/:userName/saved-jobs/:jobId', deleteSavedJob);

// for admin routes
router.post("/admin-login", AdminLogin);
router.post("/admin-signup", AdminSignup);
router.get("/admin-user", getAllAdminUserRecords);
router.delete('/delete-admin/:id', deleteAdminById);

// for admin add client
router.post("/add-client", addClient);
router.put('/update-client/:clientId', updateClient);
router.get('/admin-password-date/:clientId', getAdminPasswordRecord);
router.put("/admin-change-password/:email", AdminupdatePassword);



module.exports = router;
