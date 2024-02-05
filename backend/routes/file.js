const express = require('express')

// controller functions
const { checkSimilarity } = require('../controllers/checkSimilarity.js')
const { saveReport } = require('../controllers/reportController.js')
const requireAuth = require('../middleware/requireAuth.js')

const router = express.Router()

// router.use(requireAuth)

// fileUpload route
router.post('/', checkSimilarity)
router.post('/save-report', saveReport)

module.exports = router