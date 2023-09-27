const fetch = require('node-fetch')
const filterTrains = (trains) => {
    const filteredTrains = {}
    for (const train of trains) {
        const operationalTrainNumber = train.OperationalTrainNumber

        // Skip trains with null or undefined OperationalTrainNumber
        if (operationalTrainNumber === null || operationalTrainNumber === undefined) {
            continue
        }

        const currentTimestamp = new Date(train.ModifiedTime).getTime()

        // If train number doesn't exist or it's older than the current one
        if (
            !filteredTrains[operationalTrainNumber] ||
            currentTimestamp >
                new Date(filteredTrains[operationalTrainNumber].ModifiedTime).getTime()
        ) {
            filteredTrains[operationalTrainNumber] = train
        }
    }
    return Object.values(filteredTrains) // convert the object back to an array
}

const delayed = {
    getDelayedTrains: async function getDelayedTrains(req, res) {
        const query = `<REQUEST>
                  <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                  <QUERY objecttype="TrainAnnouncement" orderby='AdvertisedTimeAtLocation' schemaversion="1.8">
                        <FILTER>
                        <AND>
                            <EQ name="ActivityType" value="Avgang" />
                            <GT name="EstimatedTimeAtLocation" value="$now" />
                            <AND>
                                <GT name='AdvertisedTimeAtLocation' value='$dateadd(-00:15:00)' />
                                <LT name='AdvertisedTimeAtLocation' value='$dateadd(02:00:00)' />
                            </AND>
                        </AND>
                        </FILTER>
                        <INCLUDE>ActivityId</INCLUDE>
                        <INCLUDE>ActivityType</INCLUDE>
                        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
                        <INCLUDE>AdvertisedTrainIdent</INCLUDE>
                        <INCLUDE>OperationalTrainNumber</INCLUDE>
                        <INCLUDE>Canceled</INCLUDE>
                        <INCLUDE>FromLocation</INCLUDE>
                        <INCLUDE>ToLocation</INCLUDE>
                        <INCLUDE>LocationSignature</INCLUDE>
                        <INCLUDE>TimeAtLocation</INCLUDE>
                        <INCLUDE>TrainOwner</INCLUDE>
                        <INCLUDE>ModifiedTime</INCLUDE>
                  </QUERY>
            </REQUEST>`

        try {
            const response = await fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
                method: 'POST',
                body: query,
                headers: { 'Content-Type': 'text/xml' }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch data')
            }

            const result = await response.json()
            const filteredTrainData = filterTrains(result.RESPONSE.RESULT[0].TrainAnnouncement)

            return res.json({
                data: filteredTrainData
            })
        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    },

    getPositions: async function (req, res) {
        // 1. Extract the train numbers from the request body

        const trainNumbers = req.body.trainNumbers

        // 2. Check if it's an array and contains strings
        if (
            !trainNumbers ||
            !Array.isArray(trainNumbers) ||
            !trainNumbers.every((num) => typeof num === 'string')
        ) {
            return res.status(400).json({
                error: 'trainNumbers must be provided in the request body as an array of strings.'
            })
        }

        // 3. Convert the array of strings to a single comma-separated string
        const trainNumbersList = trainNumbers.join(',')

        const query = `<REQUEST>
            <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
            <QUERY namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0">
                <FILTER>
                    <IN name="Train.OperationalTrainNumber" value="${trainNumbersList}" />
                </FILTER>
            </QUERY>
        </REQUEST>`

        try {
            const response = await fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
                method: 'POST',
                body: query,
                headers: { 'Content-Type': 'text/xml' }
            })

            const result = await response.json()
            res.json({ data: result.RESPONSE.RESULT[0] })
        } catch (error) {
            console.error('Error:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

module.exports = delayed
