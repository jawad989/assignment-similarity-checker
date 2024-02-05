const express = require('express')

// controller functions
const { loginUser, signupUser } = require('../controllers/userController')
const { saveReport, getAllReports } = require('../controllers/reportController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// save report route
router.post('/save-report', saveReport)

// get all reports
router.get('/get-all-reports', getAllReports)

module.exports = router