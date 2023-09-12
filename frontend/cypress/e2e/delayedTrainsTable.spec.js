describe('Delayed Trains Component Tests', () => {

    beforeEach(() => {
        cy.visit('/'); // Assuming this is the correct URL for your component
    });

    it('should render the table headers correctly', () => {
        cy.get('table thead th').eq(0).should('contain', 'Tågnummer');
        cy.get('table thead th').eq(1).should('contain', 'Nuvarande station');
        cy.get('table thead th').eq(2).should('contain', 'Försening');
    });

    it('should display specific train data correctly', () => {
        // Intercept here
        cy.fixture('delayedTrains.json').then((delayedTrainsData) => {
            cy.intercept('GET', `${Cypress.env('BACKEND')}/delayed`, {
                body: { data: delayedTrainsData }
            }).as('delayedTrains');
        });

        // Reload or perform an action that triggers the request
        cy.visit('/');
        cy.wait('@delayedTrains');

        cy.get('[data-testid="train-number"]').first().should('contain', '12345'); // Use your fixture data for assertions
        cy.get('[data-testid="current-station"]').first().should('contain', 'Station A');
        cy.get('[data-testid="delay"]').first().should('contain', '15 minuter');
    });

    it('should navigate to ticket view on clicking a train row', () => {
        // Intercept here if needed
        cy.fixture('delayedTrains.json').then((delayedTrainsData) => {
            cy.intercept('GET', `${Cypress.env('BACKEND')}/delayed`, {
                body: { data: delayedTrainsData }
            }).as('delayedTrains');
        });

        // Reload or perform an action that triggers the request
        cy.visit('/');
        cy.wait('@delayedTrains');

        cy.get('[data-testid^="train-row-"]').first().click();
        cy.url().should('include', '/details/12345'); // Use your fixture data for assertions
    });

    // ... other tests
});
