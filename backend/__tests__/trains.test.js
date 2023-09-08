const fetch = require('node-fetch')
const fetchTrainPositions = require('../models/trains')
const EventSource = require('eventsource')

describe('fetchTrainPositions', () => {
    let mockIo
    let eventSourceInstance

    beforeEach(() => {
        // Mocks and setup
        fetch.mockReset()
        mockIo = {
            on: jest.fn((event, callback) => {
                if (event !== 'connection') {
                    callback()
                }
            })
        }

        // Create a new MockEventSource instance for each test
        eventSourceInstance = new EventSource('mocked-url')
        mockIo.on.mockImplementationOnce((event, callback) => {
            if (event === 'connection') {
                callback(eventSourceInstance)
            }
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        if (eventSourceInstance && eventSourceInstance.reset) {
            eventSourceInstance.reset()
        }
    })
    it('handles fetch and establishes SSE connection', async () => {
        // Mock fetch response with SSEURL
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                RESPONSE: {
                    RESULT: [
                        {
                            INFO: {
                                SSEURL: 'mocked-url'
                            }
                        }
                    ]
                }
            })
        })

        await fetchTrainPositions(mockIo)

        // Assertions
        expect(fetch).toHaveBeenCalledWith(
            'https://api.trafikinfo.trafikverket.se/v2/data.json',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'text/xml' }
            })
        )
        expect(eventSourceInstance.url).toBe('mocked-url')
    })

    it('logs error and exits early when SSEURL is missing', async () => {
        // Mock fetch response without SSEURL
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                RESPONSE: {
                    RESULT: [{}]
                }
            })
        })

        const consoleErrorSpy = jest.spyOn(console, 'error')
        await fetchTrainPositions(mockIo)

        // Assertions
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'SSEURL not found in the result object:',
            expect.any(String)
        )
    })

    //   it("triggers onopen event correctly", async () => {
    //     // Mock fetch response
    //     fetch.mockResolvedValueOnce({
    //       json: jest.fn().mockResolvedValueOnce({
    //         RESPONSE: {
    //           RESULT: [
    //             {
    //               INFO: {
    //                 SSEURL: "mocked-url",
    //               },
    //             },
    //           ],
    //         },
    //       }),
    //     });

    //     // Set up the spy on console.log
    //     const consoleLogSpy = jest.spyOn(console, "log");
    //     // Call the fetchTrainPositions function
    //     await fetchTrainPositions(mockIo);

    //     // Assertions
    //     expect(consoleLogSpy).toHaveBeenCalledWith("Connection to server opened.");

    //     // Clean up the spy
    //     consoleLogSpy.mockRestore();
    // });

    it("logs 'a user connected' when a user connects", async () => {
        // Mock fetch response
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                RESPONSE: {
                    RESULT: [
                        {
                            INFO: {
                                SSEURL: 'mocked-url'
                            }
                        }
                    ]
                }
            })
        })

        // Set up the spy on console.log
        const consoleLogSpy = jest.spyOn(console, 'log')

        // Call the fetchTrainPositions function
        await fetchTrainPositions(mockIo)

        // Assertions
        expect(consoleLogSpy).toHaveBeenCalledWith('a user connected')

        // Clean up the spy
        consoleLogSpy.mockRestore()
    })

    it('processes SSE messages and emits correctly', async () => {
        // Mock fetch response
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({
                RESPONSE: {
                    RESULT: [
                        {
                            INFO: {
                                SSEURL: 'mocked-url'
                            }
                        }
                    ]
                }
            })
        })

        await fetchTrainPositions(mockIo)

        const mockedMessage = {
            data: JSON.stringify({
                RESPONSE: {
                    RESULT: [
                        {
                            TrainPosition: [{}]
                        }
                    ]
                }
            })
        }
        eventSourceInstance.trigger('message', mockedMessage)
    })
})
