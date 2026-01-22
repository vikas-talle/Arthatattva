// ***********************************************************
// Support file - runs before every test file
// ***********************************************************

// Import commands.js
import './commands';

// Global Configuration
beforeEach(() => {
  // Handle uncaught exceptions
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false to prevent Cypress from failing the test
    if (err.message.includes('ResizeObserver') || 
        err.message.includes('Script error')) {
      return false;
    }
    return true;
  });
});

// Clear cookies before each test
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});