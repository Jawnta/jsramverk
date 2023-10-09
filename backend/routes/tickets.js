const express = require('express')
const router = express.Router()
const authJwt = require('../middleware/authJwt.js')
const tickets = require('../models/tickets.js')

router.get('/', authJwt, (req, res) => tickets.getTickets(req, res))

router.post('/', authJwt, (req, res) => tickets.createTicket(req, res))

router.put('/:id', authJwt, (req, res) => tickets.updateTicket(req, res))

module.exports = router
