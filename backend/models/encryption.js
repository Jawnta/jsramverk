const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const sixDaysInMilliseconds = 6 * 24 * 60 * 60 * 1000

const saltRounds = 10

const hash = async (value) => {
    return await bcrypt.hash(value, saltRounds)
}

const compare = async (clearText, encrypted) => {
    return await bcrypt.compare(clearText, encrypted)
}

const passwordIsString = (password) => {
    if (typeof password !== 'string') {
        throw new Error('Invalid password')
    }
}

const signToken = (user) => {
    return jwt.sign({ userId: user._id, email: user.email }, jwtSecret, {
        expiresIn: sixDaysInMilliseconds
    })
}

const compareToken = (token) => {
    return jwt.verify(token, jwtSecret)
}
module.exports = { hash, compare, passwordIsString, signToken, compareToken }
