describe('Onboard waiting Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access onboard waiting, without errors', () => {
    cy.visit(`/onboard/integrating`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });
});
