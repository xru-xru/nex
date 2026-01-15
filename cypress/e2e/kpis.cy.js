describe('Kpis Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access kpis, without errors', () => {
    cy.visit('/kpis');
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });
});
