// middleware/authenticateJWT.js
const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET)
            req.user = user
            next()
        } catch (e) {
            return res.sendStatus(403) // Forbidden, token is invalid or expired
        }
    } else {
        res.sendStatus(401) // Unauthorized, no token provided
    }
}

module.exports = authenticateJWT
