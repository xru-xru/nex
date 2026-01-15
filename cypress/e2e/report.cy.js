describe('Report Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access report, without errors', () => {
    cy.visit(`/reports/91`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });

  it('Should have download buttons', () => {
    const downloadMenu = cy.getByText(/download/i);
    downloadMenu.should('exist');
    downloadMenu.click();
    cy.getByText(/pdf/i).should('exist');
    cy.getByText(/excel/i).should('exist');
  });
});
