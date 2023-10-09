const express = require('express')
const encrypt = require('../models/encryption')
const router = express.Router()
const register = require('../models/register')
const userModel = require('../models/user')
const sixDaysInMilliseconds = 6 * 24 * 60 * 60 * 1000

router.post('/register', async (req, res) => {
    try {
        const userData = req.body
        if (!userData || !userData.email || !userData.password) {
            return res.status(400).json({ error: 'User data is missing in the request body.' })
        }
        const token = await register.registerLocalUser(userData)
        res.cookie('jwt', token, {
            httpOnly: false,
            maxAge: sixDaysInMilliseconds,
            path: '/',
            secure: false
        })

        res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
        console.error('User registration error:', err)
        res.status(500).json({ error: 'User registration failed' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const userData = req.body
        if (!userData || !userData.email || !userData.password) {
            return res.status(400).json({ error: 'User data is missing in the request body.' })
        }

        const user = userModel.getUser(userData.email)
        const token = encrypt.signToken(user)
        res.cookie('jwt', token, {
            httpOnly: false,
            maxAge: sixDaysInMilliseconds,
            path: '/',
            secure: false
        })

        res.status(201).json({ message: 'User login successfully' })
    } catch (err) {
        console.error('User login error:', err)
        res.status(500).json({ error: 'User login failed' })
    }
})

module.exports = router
