describe('Kpi compare Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access kpi compare, without errors', () => {
    cy.visit(`/kpis/compare`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });

  it('Should have save as report button', () => {
    cy.getByText(/save as report/i).should('exist');
  });
});
