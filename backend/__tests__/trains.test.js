const fetchTrainPositions = require('../models/trains.js')
const fetch = require('node-fetch')
const EventSource = require('eventsource')
const { mock } = require('jest-mock-extended')

jest.mock('node-fetch')
jest.mock('eventsource')

class MockResponse {
    constructor(body, init = {}) {
        this.body = body
        this.status = init.status || 200
        this.statusText = init.statusText || 'OK'
    }

    json() {
        return Promise.resolve(JSON.parse(this.body))
    }

    text() {
        return Promise.resolve(this.body)
    }

    ok() {
        return this.status >= 200 && this.status < 300
    }
}

describe('fetchTrainPositions', () => {
    let ioMock, eventSourceInstance, fetchResponseMock, sseurl
    let socketMock
    beforeEach(() => {
        // Reset all mock implementations before each test
        jest.clearAllMocks()
        sseurl = 'mock-sseurl'

        // Mock response for the fetch function
        fetchResponseMock = new MockResponse(
            JSON.stringify({
                RESPONSE: {
                    RESULT: [
                        {
                            INFO: {
                                SSEURL: sseurl
                            }
                        }
                    ]
                }
            })
        )
        fetch.mockResolvedValue(fetchResponseMock)

        // Mock an instance for the EventSource
        eventSourceInstance = {
            onopen: jest.fn(),
            onmessage: jest.fn(),
            onerror: jest.fn()
        }

        // Mock the EventSource constructor to return the mock instance
        EventSource.mockImplementation(() => eventSourceInstance)
        // Create a mocked socket with an emit function
        socketMock = mock()
        socketMock.emit = jest.fn()
        ioMock = {
            on: jest.fn((event, callback) => {
                // Capture the callback function to invoke later
                if (event === 'connection') {
                    callback(socketMock)
                }
            })
        }
    })

    it('should fetch train positions and handle server sent events', async () => {
        await fetchTrainPositions(ioMock)

        // First, simulate the io connection
        ioMock.on.mock.calls[0][1](socketMock)

        // Now, simulate an event from EventSource
        const eventData = {
            RESPONSE: {
                RESULT: [
                    {
                        TrainPosition: [
                            {
                                Train: {
                                    AdvertisedTrainNumber: 'NewTestDatahere124'
                                },
                                Position: {
                                    WGS84: '58.1234,11.1234'
                                },
                                TimeStamp: '2023-09-18T12:34:56.789Z',
                                Bearing: 90,
                                Deleted: false,
                                Speed: 60
                            }
                        ]
                    }
                ]
            }
        }
        eventSourceInstance.onmessage({
            data: JSON.stringify(eventData)
        })
        const updatedData = {
            RESPONSE: {
                RESULT: [
                    {
                        TrainPosition: [
                            {
                                Train: {
                                    AdvertisedTrainNumber: 'NewTestDatahere124'
                                },
                                Position: {
                                    WGS84: '58.5678,11.5678'
                                },
                                TimeStamp: '2023-09-18T12:35:56.789Z',
                                Bearing: 180,
                                Deleted: false,
                                Speed: 120
                            }
                        ]
                    }
                ]
            }
        }
        eventSourceInstance.onmessage({
            data: JSON.stringify(updatedData)
        })
        // Assert that socket.emit was called with the correct parameters
        expect(ioMock.on).toHaveBeenCalledWith('connection', expect.any(Function))
        expect(ioMock.on).toHaveBeenCalledTimes(1)
        expect(ioMock.on.mock.calls[0][0]).toBe('connection')
        expect(socketMock.emit).toHaveBeenCalledWith('message', {
            trainnumber: 'NewTestDatahere124',
            position: [11.5678, 58.5678],
            timestamp: '2023-09-18T12:35:56.789Z',
            bearing: 180,
            status: true,
            speed: 120
        })
    })

    it('should not process invalid or empty parsedData', async () => {
        // Initiate fetchTrainPositions with the mock
        await fetchTrainPositions(ioMock)

        // Simulate the io connection
        ioMock.on.mock.calls[0][1](socketMock)

        // Send an empty message or a message that parses to a falsy value, such as 'null' or 'false'.
        eventSourceInstance.onmessage({
            data: 'null'
        })

        // Validate that socket.emit was NOT called.
        expect(socketMock.emit).not.toHaveBeenCalled()
    })

    it('should handle onerror event', async () => {
        // Mock response with SSEURL
        const mockResponse = {
            RESPONSE: {
                RESULT: [
                    {
                        INFO: {
                            SSEURL: 'mock-sseurl'
                        }
                    }
                ]
            }
        }

        // Mock the fetch response
        fetch.mockResolvedValueOnce({
            json: () => mockResponse
        })

        // Intercept calls to console.log
        const consoleLogSpy = jest.spyOn(console, 'log')

        await fetchTrainPositions(ioMock)

        // Simulate an onerror event
        eventSourceInstance.onerror()

        // Check if console.log was called with the expected message
        expect(consoleLogSpy).toHaveBeenCalledWith('EventSource failed.')
    })

    it('should handle malformed JSON data', async () => {
        // Spy on console.log to assert later
        const consoleLogSpy = jest.spyOn(console, 'log')

        await fetchTrainPositions(ioMock)

        // Simulate the io connection
        ioMock.on.mock.calls[0][1](socketMock)

        // Send malformed JSON data
        eventSourceInstance.onmessage({
            data: 'this is not valid JSON'
        })
        expect(consoleLogSpy).toHaveBeenCalled()
        expect(consoleLogSpy.mock.calls[2][0]).toBeInstanceOf(SyntaxError)
        expect(consoleLogSpy.mock.calls[2][0].message).toContain('Unexpected token')
        // Restore the original console.log function after the test
        consoleLogSpy.mockRestore()
    })
    it('should handle onopen event', async () => {
        // Intercept calls to console.log
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

        await fetchTrainPositions(ioMock)

        // Simulate the onopen event
        eventSourceInstance.onopen()

        // Check if console.log was called with the expected message
        expect(consoleLogSpy).toHaveBeenCalledWith('Connection to server opened.')
    })
})
