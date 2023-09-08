describe('Component Tests', () => {
    // Load the page or component before running the tests
    beforeEach(() => {
        cy.visit('/') 
    })

    it('should render the trainsTable component', () => {
        cy.get('.trainList').within(() => {
            cy.get('[data-testid="trainsTableComponent"]').should('be.visible')
        })
    })

    it('should render the mapComponentVue', () => {
        cy.get('.map').within(() => {
            cy.get('[data-testid="mapComponentVue"]').should('be.visible')
        })
    })
})
