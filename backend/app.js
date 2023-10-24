require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetchTrainPositions = require('./models/trains.js')
const delayed = require('./routes/delayed.js')
const tickets = require('./routes/tickets.js')
const codes = require('./routes/codes.js')
const ticketLock = require('./models/ticketGuard.js')
const app = express()
const httpServer = require('http').createServer(app)
const auth = require('./routes/auth.js')
const cookieParser = require('cookie-parser')

app.use(
    cors({
        origin: ['https://109.228.158.227:9000', 'https://www.student.bth.se'],
        credentials: true
    })
)
app.use(cookieParser())
// app.disable('x-powered-by')
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
const port = process.env.PORT || 1337

app.get('/', (req, res) => {
    res.json({
        data: 'Hello World!'
    })
})

app.use('/delayed', delayed)
app.use('/tickets', tickets)
app.use('/codes', codes)
app.use('/auth', auth)
ticketLock(io.of('/tickets'))
httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

fetchTrainPositions(io)
