// ***********************************************
// Custom Commands for Arththattva Application
// ***********************************************

// Login Command
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[placeholder="Enter Email ID"]', { timeout: 10000 }).should('be.visible').clear().type(email);
    cy.get('input[placeholder="Min. 8 Characters"]').should('be.visible').clear().type(password, { log: false });
    cy.get('button').contains('Log In').click();
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
  });
});

// Verify Dashboard
Cypress.Commands.add('verifyDashboard', () => {
  cy.visit('/dashboard');
  cy.url().should('include', '/dashboard');
  cy.contains('Dashboard', { timeout: 10000 }).should('be.visible');
  cy.contains('Total Pending Tickets').should('be.visible');
});

// Intercept Login API
Cypress.Commands.add('interceptLogin', () => {
  cy.intercept('POST', '**/api/auth/login').as('loginRequest');
});

// Intercept Tickets API
Cypress.Commands.add('interceptTickets', () => {
  cy.intercept('GET', '**/api/tickets**').as('getTickets');
});

// Select Status Filter
Cypress.Commands.add('selectStatusFilter', (statuses) => {
  cy.get('button').contains('Status').click();
  statuses.forEach(status => {
    cy.contains(status).click();
  });
  cy.get('body').click(0, 0); // Close dropdown
});

// Select Assignee Filter
Cypress.Commands.add('selectAssigneeFilter', (assignee) => {
  cy.get('button').contains('Assignee').click();
  cy.get('input[placeholder="Search assignee..."]').type(assignee);
  cy.contains(assignee).click();
  cy.get('body').click(0, 0); // Close dropdown
});

// Logout
Cypress.Commands.add('logout', () => {
  cy.contains('Logout').click();
  cy.url().should('include', '/login');
});

// Wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.wait(500);
});