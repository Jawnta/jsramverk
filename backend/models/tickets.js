const database = require('../db/database.js')

const tickets = {
    getTickets: async function getTickets(req, res) {
        const db = await database.openDb()
        const collection = db.collection('tickets')

        // Fetch all tickets and sort them by their insertion order (assuming they're inserted in order)
        const allTickets = await collection.find({}).sort({ _id: -1 }).toArray()

        return res.json({
            data: allTickets
        })
    },

    createTicket: async function createTicket(req, res) {
        const db = await database.openDb()
        const collection = db.collection('tickets')

        const ticket = {
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        }

        const result = await collection.insertOne(ticket)

        return res.json({
            data: {
                id: result.insertedId,
                ...ticket
            }
        })
    }
}

module.exports = tickets
