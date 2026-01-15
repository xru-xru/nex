describe('Report new Page', () => {
  before(() => {
    cy.login();
  });

  it('Should trigger new report modal, without errors and correct elements', () => {
    cy.visit(`/reports`);
    const newReportBtn = cy.getByText(/new report/i);

    newReportBtn.should('exist');
    newReportBtn.click();
    cy.wait(300);

    cy.getByText(/select report type/i).should('exist');
    cy.getByText(/kpis/i, { selector: 'h3' }).should('exist');
    cy.getByText(/next step/i)
      .parent('button')
      .should('exist')
      .and('be.disabled');
  });

  it('Should navigate through new kpi report flow correctly', () => {
    cy.visit(`/reports`);
    cy.getByText(/new report/i).click();
    cy.wait(300);

    // Step 1
    // Report type
    cy.getByText(/kpis/i, { selector: 'h3' }).parent("div[role='button']").click();

    cy.getByText(/next step/i)
      .parent('button')
      .click();

    // Step 2
    // Campaigns selection
    cy.queryByText(/Noo.... It's not your fault./i, { timeout: 3000 }).should('not.exist');
    cy.get('.NEXYSnack').should('not.exist');

    cy.getByText(/next step/i)
      .parent('button')
      .should('be.disabled');

    cy.get('.NEXYDialogContent .NEXYTableRow').first().click();

    cy.getByText(/next step/i)
      .parent('button')
      .should('not.be.disabled')
      .click();

    // Step 3
    // Report details
    cy.getByPlaceholderText(/report name/i).should('exist');
    cy.getByPlaceholderText(/small reminder what/i).should('exist');

    cy.getByText(/create report/i)
      .parents('button')
      .should('exist')
      .and('be.disabled');

    cy.getByPlaceholderText(/report name/i).type('report');
    cy.getByText(/create report/i)
      .parents('button')
      .should('not.be.disabled');

    cy.get('.NEXYDialog').within(($dialog) => {
      cy.getByText(/fixed/i).parent('button').click();
    });

    cy.get('.DayPicker').should('exist');
  });
});
