const database = require('../db/database.js')
const { ObjectId } = require('mongodb')

const user = {
    getUser: async function getUser(userData) {
        try {
            const db = await database.openDb()
            const collection = db.collection('user')

            const currentUser = await collection.findOne({ email: userData })

            if (!currentUser) {
                return false
            }
            return currentUser
        } catch (e) {
            throw new Error('Something went wrong')
        }
    },

    createUser: async function createUser(req) {
        const db = await database.openDb()
        const collection = db.collection('user')

        const id = req.body.id

        const userData = {
            email: req.body.email,
            password: req.body.password
        }

        const user = this.getUser(id)

        if (user) {
            throw new Error('User already exists.')
        }

        const result = await collection.insertOne(userData)
        return result
    },

    updateTicket: async function updateTicket(req, res) {
        const db = await database.openDb()
        const collection = db.collection('tickets')

        const id = new ObjectId(req.params.id)

        const updatedTicket = req.body

        const result = await collection.updateOne({ _id: id }, { $set: updatedTicket })
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'No ticket found with the specified id' })
        }

        return res.json({ success: true })
    }
}

module.exports = user
