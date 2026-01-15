describe('Dashboard add kpi Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access dashboard add kpi, without errors', () => {
    cy.visit(`/dashboard/selection`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });
});
