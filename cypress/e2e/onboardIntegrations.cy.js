describe('Onboard integrations Page', () => {
  before(() => {
    cy.login();
  });

  it('Should access onboard integrations, without errors', () => {
    cy.visit(`/onboard/integrations`);
    cy.queryByText("Noo.... It's not your fault.", { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnackbar').should('not.exist');
  });

  it('Should have 5 integration cards', () => {
    cy.get('.NEXYCard').should((c) => {
      expect(c).to.have.length(5);
    });
  });

  it('Should have continue button', () => {
    cy.getByText(/continue/i).should('exist');
  });
});
