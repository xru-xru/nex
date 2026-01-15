describe('Settings Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access settings, without errors', () => {
    cy.visit('/settings');
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });
});
