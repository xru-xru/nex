describe('Onboard name Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access onboard name, without errors', () => {
    cy.visit(`/onboard/name`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });

  it('Should have all the input fields', () => {
    cy.getByLabelText(/first name/i).should('exist');
    cy.getByLabelText(/last name/i).should('exist');
    cy.getByLabelText(/company/i).should('exist');
  });
});
