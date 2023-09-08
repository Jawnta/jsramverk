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
    ];

    beforeEach(() => {
        // Intercepting the API call to return mock data and aliasing it.
        cy.intercept('GET', `${Cypress.env('BACKEND')}/delayed`, {
            body: { data: delayedTrainsData }
        }).as('fetchDelayedTrains');

        cy.visit('/');
    });

    it('should display delayed trains correctly', () => {
        cy.wait('@fetchDelayedTrains'); // Wait for the intercepted request

        cy.get('.delayed .train-number', { timeout: 10000 }) // 10 seconds timeout
            .first()
            .should('contain', '12345');
        cy.get('.delayed .current-station', { timeout: 10000 }) 
            .first()
            .should('contain', 'Station A');
        cy.get('.delayed .delay', { timeout: 10000 })
            .first()
            .should('contain', '15 minuter');
    });

    it('should navigate to ticket view on clicking a train row', () => {
        cy.wait('@fetchDelayedTrains'); // Wait for the intercepted request

        cy.get('.delayed tbody tr', { timeout: 10000 })
            .first()
            .click();
        cy.url().should('include', '/details/12345');
    });
});
