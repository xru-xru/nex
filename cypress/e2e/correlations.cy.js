describe('Correlations Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access correlations, without errors', () => {
    cy.visit('/correlations');
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });

  it('Should have negative correlation section', () => {
    cy.queryByText(/Negative Correlation/i).should('exist');
  });

  it('should have positive correlation section', () => {
    cy.queryByText(/Positive Correlation/i).should('exist');
  });
});
