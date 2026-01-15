describe('Reports Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access reports, without errors', () => {
    cy.visit('/reports');
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });
});
