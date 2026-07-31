describe('Dashboard widget workflow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('adds a widget from the bottom sheet to the dashboard grid', () => {
    cy.get('.edit-icon').should('be.visible').click()
    cy.get('.add-icon').should('be.visible').click()

    cy.get('.sheet-content').should('be.visible')
    cy.get('.sheet-content [data-tile="stat"]').should('be.visible').click()
    cy.get('.sheet-content .btn-primary').should('be.visible').click()

    cy.get('.dashboard-grid .card').should('have.length.at.least', 1)
    cy.get('.dashboard-grid .tile-frame').should('have.length.at.least', 1)
  })

  it('cancels adding a widget and leaves the grid unchanged', () => {
    cy.get('.edit-icon').should('be.visible').click()
    cy.get('.add-icon').should('be.visible').click()

    cy.get('.sheet-content').should('be.visible')
    cy.get('.sheet-content [data-tile="ring"]').should('be.visible').click()
    cy.get('.sheet-content .btn-secondary').should('be.visible').click()

    cy.get('.sheet-content').should('not.be.visible')
    cy.get('.dashboard-grid .card').should('have.length', 0)
  })

  it('adds multiple widgets in sequence', () => {
    cy.get('.edit-icon').should('be.visible').click()

    cy.get('.add-icon').should('be.visible').click()
    cy.get('.sheet-content [data-tile="stat"]').should('be.visible').click()
    cy.get('.sheet-content .btn-primary').should('be.visible').click()

    cy.get('.add-icon').should('be.visible').click()
    cy.get('.sheet-content [data-tile="trend"]').should('be.visible').click()
    cy.get('.sheet-content .btn-primary').should('be.visible').click()

    cy.get('.dashboard-grid .tile-frame').should('have.length.at.least', 2)
    cy.get('.dashboard-grid .card').should('have.length.at.least', 2)
  })

  it('switches workspace and keeps the dashboard interactive', () => {
    cy.get('.edit-icon').should('be.visible').click()
    cy.get('.add-icon').should('be.visible').click()
    cy.get('.sheet-content [data-tile="header"]').should('be.visible').click()
    cy.get('.sheet-content .btn-primary').should('be.visible').click()

    cy.get('.dashboard-grid .card').should('have.length.at.least', 1)
    cy.get('.dashboard-grid .tile-frame').should('have.length.at.least', 1)

    cy.get('.navbar .dot').eq(1).click({ force: true })
    cy.get('.dashboard-grid').should('be.visible')
  })
})
