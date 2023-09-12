describe('Delayed Trains Component Tests', () => {
    const delayedTrainsData = [
        // Mock data for your delayed trains
        {
            OperationalTrainNumber: '12345',
            LocationSignature: 'Station A',
            FromLocation: [{ LocationName: 'Start A' }],
            ToLocation: [{ LocationName: 'Destination A' }],
            AdvertisedTimeAtLocation: '2023-09-01T10:00:00',
            EstimatedTimeAtLocation: '2023-09-01T10:15:00'
        }
    ]

    beforeEach(() => {
        // Intercepting the API call to return mock data.
        cy.intercept('GET', `${Cypress.env('BACKEND')}/delayed`, {
            body: { data: delayedTrainsData }
        }).as('getDelayedTrains')
        console.log("BACKEND URL: ", Cypress.env('BACKEND'))
        cy.visit('/')
        cy.wait('@getDelayedTrains')
    })

    it('should display delayed trains correctly', () => {
        cy.get('.delayed .train-number').first().should('be.visible').should('contain', '12345')
        cy.get('[data-testid="current-station"]').first().should('contain', 'Station A')
        cy.get('[data-testid="delay"]').first().should('contain', '15 minuter')
    })

    it('should navigate to ticket view on clicking a train row', () => {
        cy.get('[data-testid="train-row-12345"]').first().click()
        cy.url().should('include', '/details/12345')
    })
    
})
