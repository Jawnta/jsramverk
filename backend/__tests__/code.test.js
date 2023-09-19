const request = require('supertest')
const express = require('express')
const codes = require('../models/codes')
const fetch = require('node-fetch')

// Mock environment variable
process.env.TRAFIKVERKET_API_KEY = 'test-api-key'

const app = express()
app.use('/codes', codes.getCodes)

describe('getCodes', () => {
    beforeEach(() => {
        fetch.mockReset()
    })

    it('should return codes successfully', async () => {
        const mockApiResponse = {
            RESPONSE: {
                RESULT: [
                    {
                        ReasonCode: [{ test: 'Test' }]
                    }
                ]
            }
        }
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockApiResponse)
        })

        const res = await request(app).get('/codes')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
    })

})
