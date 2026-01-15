describe('Notifications Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access notifications, without errors', () => {
    cy.visit(`/notifications`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });

  it('Should have notifications title', () => {
    cy.getByText(/notifications/i).should('exist');
  });
});
