// Create an object to store open connections based on trainNumber
const openConnections = {}

async function ticketLock(io) {
    io.on('connection', (socket) => {
        socket.on('ticketLocked', async (trainNumber) => {
            if (openConnections[trainNumber]) {
                socket.emit('connectionError', 'Connection already opened')
                return
            }
            socket.trainNumber = trainNumber
            openConnections[trainNumber] = socket
            io.emit('ticketUnlocked', trainNumber)
        })
        socket.on('disconnect', () => {
            if (socket.trainNumber) {
                delete openConnections[socket.trainNumber]
            }
        })
    })
}

module.exports = ticketLock
