const encrypt = require('./encryption.js')
const database = require('../db/database.js')
const userModel = require('./user.js')
const registerLocalUser = async (userData) => {
    try {
        const db = await database.openDb()
        const collection = db.collection('user')
        const userAlreadyExists = await userModel.getUser(userData.email)
        if (userAlreadyExists) {
            throw new Error('User registration failed: User already exists')
        }

        encrypt.passwordIsString(userData.password)
        const hashedPassword = await encrypt.hash(userData.password)
        const user = await collection.insertOne({ email: userData.email, password: hashedPassword })
        if (!user) {
            throw new Error('User registration failed: Unable to create user')
        }
        const token = encrypt.signToken(user)
        return token
    } catch (error) {
        console.error('User registration error:', error)
        throw new Error('User registration failed')
    }
}

module.exports = { registerLocalUser }
