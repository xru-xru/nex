describe('Kpi Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access kpi, without errors', () => {
    cy.visit(`/kpis/18091111/239`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });
});
