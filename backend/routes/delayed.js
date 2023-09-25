const express = require('express')
const router = express.Router()

const delayed = require('../models/delayed.js')

router.get('/', (req, res) => delayed.getDelayedTrains(req, res))
router.post('/position', (req, res) => {
    console.log(req.body) // Log the incoming request body
    delayed.getPositions(req, res)
})
module.exports = router
