describe('Dashboard Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access dashboard, without errors', () => {
    cy.visit('/');
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });

  it('Should have kpi section', () => {
    cy.queryByText(/Dashboard KPIs/i).should('exist');
    cy.queryByText(/add kpi/i).should('exist');
  });
});
