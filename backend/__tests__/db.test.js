jest.mock('mongodb')

const { MongoClient } = require('mongodb')

// Mock the client and the connect function
const mockConnect = jest.fn()
MongoClient.mockImplementation(() => ({
    connect: mockConnect
}))

const database = require('../db/database')

let consoleErrorSpy

beforeEach(() => {
    // Reset all mock implementations before each test
    mockConnect.mockClear()

    // Spy on console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
    // Restore the console.error spy
    consoleErrorSpy.mockRestore()
})
describe('database', () => {
    describe('openDb', () => {
        it('should open the database successfully', async () => {
            const mockDbInstance = { db: jest.fn().mockReturnValue('mockDb') }
            mockConnect.mockResolvedValueOnce(mockDbInstance)

            const result = await database.openDb()
            expect(result).toBe('mockDb')
        })
    })
})
describe('openDb', () => {
    it('should handle connection error', async () => {
        const mockError = new Error('Connection Error')
        mockConnect.mockRejectedValueOnce(mockError)

        await database.openDb()
        expect(consoleErrorSpy).toHaveBeenCalledWith(mockError)
    })
})
