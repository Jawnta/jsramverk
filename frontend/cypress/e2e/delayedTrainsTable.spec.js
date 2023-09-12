describe('Delayed Trains Component Tests', () => {

    beforeEach(() => {
        // Load the fixture and set up the intercept
        cy.fixture('delayedTrains.json').then((delayedTrainsData) => {
            cy.intercept('GET', `https://jsramverk-editor-jorp.azurewebsites.net/delayed`, {
                body: { data: delayedTrainsData }
            }).as('delayedTrains');
        });
        cy.visit('/', { timeout: 10000 });
        cy.wait('@delayedTrains', { timeout: 10000 });

    });

    it('should display delayed trains correctly', () => {
        cy.get('[data-testid="train-number"]').first().should('contain', '12345');
        cy.get('[data-testid="current-station"]').first().should('contain', 'Station A');
        cy.get('[data-testid="delay"]').first().should('contain', '15 minuter');
    });

    it('should navigate to ticket view on clicking a train row', () => {
        cy.get('[data-testid="train-row-12345"]').first().click();
        cy.url().should('include', '/details/12345');
    });
});
