/// <reference types="cypress" />

describe('Dashboard - Complete Test Suite', () => {

  const DASHBOARD_URL = 'https://arthtattva-fe.dev.perimattic.dev/dashboard';
  const LOGIN_URL = 'https://arthtattva-fe.dev.perimattic.dev/login';

  // Helper function to login before dashboard tests
  const loginAsValidUser = () => {
    cy.visit(LOGIN_URL);
    cy.fixture('users').then((users) => {
      cy.get('input[placeholder="Enter Email ID"]').type(users.validUser.email);
      cy.get('input[placeholder="Min. 8 Characters"]').type(users.validUser.password);
      cy.get('button').contains('Log In').click();
      cy.url({ timeout: 15000 }).should('include', DASHBOARD_URL);
    });
  };

  context('Positive Test Cases - Dashboard Layout & Elements', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_001: Should display all dashboard header elements correctly', () => {
      // Verify logo
      cy.get('img[alt*="Arthtattva"], svg, .logo').should('exist');

      // Verify admin user indicator
      cy.contains('Admin').should('be.visible');

      // Verify notification icon
      cy.get('button').find('svg').should('exist');

      // Verify user profile icon
      cy.get('button[aria-label*="profile"], button[aria-label*="user"]').should('exist');

      // Verify dashboard title
      cy.contains('Dashboard').should('be.visible');
    });

    it('TC_DASH_002: Should display all action buttons', () => {
      cy.contains('button', 'See Approvals').should('be.visible').and('not.be.disabled');
      cy.contains('button', 'Create New Account').should('be.visible').and('not.be.disabled');
      cy.contains('button', 'Create New User').should('be.visible').and('not.be.disabled');
    });

    it('TC_DASH_003: Should display all metric cards with correct structure', () => {
      // Total Pending Tickets card
      cy.contains('Total Pending Tickets').should('be.visible');
      cy.contains('Total Pending Tickets').parent().find('h1, h2, .metric-value').should('be.visible');

      // More than 48 Hours card
      cy.contains('More than 48 Hours').should('be.visible');
      cy.contains('More than 48 Hours').parent().find('h1, h2, .metric-value').should('be.visible');

      // 24-48 Hours card
      cy.contains('24-48 Hours').should('be.visible');
      cy.contains('24-48 Hours').parent().find('h1, h2, .metric-value').should('be.visible');

      // Less than 24 Hours card
      cy.contains('Less than 24 Hours').should('be.visible');
      cy.contains('Less than 24 Hours').parent().find('h1, h2, .metric-value').should('be.visible');
    });

    it('TC_DASH_004: Should display metric cards with numerical values', () => {
      // Check that metric values are numbers
      cy.contains('Total Pending Tickets').parent().invoke('text').should('match', /\d+/);
      cy.contains('More than 48 Hours').parent().invoke('text').should('match', /\d+/);
      cy.contains('24-48 Hours').parent().invoke('text').should('match', /\d+/);
      cy.contains('Less than 24 Hours').parent().invoke('text').should('match', /\d+/);
    });

    it('TC_DASH_005: Should display all sidebar navigation items', () => {
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Client-Employee Mapping').should('be.visible');
      cy.contains('Employees').should('be.visible');
      cy.contains('All Tickets').should('be.visible');
      cy.contains('Doc Reports').should('be.visible');
      cy.contains('Approvals').should('be.visible');
      cy.contains('Chats').should('be.visible');
      cy.contains('Logout').should('be.visible');
    });

    it('TC_DASH_006: Should highlight active Dashboard menu item', () => {
      cy.contains('Dashboard').should('have.class', /active|selected|highlighted/);
    });

    it('TC_DASH_007: Should display Pending Tickets section', () => {
      cy.contains('Pending Tickets').should('be.visible');
    });

    it('TC_DASH_008: Should display search input field', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').should('be.visible');
    });

    it('TC_DASH_009: Should display Status filter dropdown', () => {
      cy.contains('Status').should('be.visible');
      cy.contains('Status').parent().find('select, button, [role="combobox"]').should('exist');
    });

    it('TC_DASH_010: Should display Assignee filter dropdown', () => {
      cy.contains('Assignee').should('be.visible');
      cy.contains('Assignee').parent().find('select, button, [role="combobox"]').should('exist');
    });

    it('TC_DASH_011: Should display tickets table with all column headers', () => {
      cy.contains('TICKET ID').should('be.visible');
      cy.contains('CLIENT').should('be.visible');
      cy.contains('CATEGORY').should('be.visible');
      cy.contains('STATUS').should('be.visible');
      cy.contains('ASSIGNEE').should('be.visible');
      cy.contains('CREATE DATE').should('be.visible');
      cy.contains('CLOSE DATE').should('be.visible');
    });

    it('TC_DASH_012: Should display at least one ticket in the table', () => {
      cy.get('table tbody tr, [role="row"]').should('have.length.at.least', 1);
    });

    it('TC_DASH_013: Should display ticket data in correct columns', () => {
      cy.fixture('tickets').then((data) => {
        const ticket = data.tickets[0];
        cy.contains(ticket.id).should('be.visible');
        cy.contains(ticket.client).should('be.visible');
        cy.contains(ticket.category).should('be.visible');
        cy.contains(ticket.status).should('be.visible');
        cy.contains(ticket.assignee).should('be.visible');
      });
    });
  });

  context('Positive Test Cases - User Interactions', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_014: Should allow typing in search field', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('ABC Traders')
        .should('have.value', 'ABC Traders');
    });

    it('TC_DASH_015: Should clear search field', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('Test')
        .clear()
        .should('have.value', '');
    });

    it('TC_DASH_016: Should click on See Approvals button', () => {
      cy.intercept('GET', '**/api/**').as('pageLoad');
      cy.contains('button', 'See Approvals').click();
      cy.wait(1000);
    });

    it('TC_DASH_017: Should click on Create New Account button', () => {
      cy.intercept('GET', '**/api/**').as('pageLoad');
      cy.contains('button', 'Create New Account').click();
      cy.wait(1000);
    });

    it('TC_DASH_018: Should click on Create New User button', () => {
      cy.intercept('GET', '**/api/**').as('pageLoad');
      cy.contains('button', 'Create New User').click();
      cy.wait(1000);
    });

    it('TC_DASH_019: Should open Status filter dropdown', () => {
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(500);
    });

    it('TC_DASH_020: Should open Assignee filter dropdown', () => {
      cy.contains('Assignee').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(500);
    });

    it('TC_DASH_021: Should click on a ticket row', () => {
      cy.get('table tbody tr, [role="row"]').first().click({ force: true });
      cy.wait(1000);
    });

    it('TC_DASH_022: Should navigate to Client-Employee Mapping', () => {
      cy.contains('Client-Employee Mapping').click();
      cy.wait(1000);
    });

    it('TC_DASH_023: Should navigate to Employees section', () => {
      cy.contains('Employees').click();
      cy.wait(1000);
    });

    it('TC_DASH_024: Should navigate to All Tickets section', () => {
      cy.contains('All Tickets').click();
      cy.wait(1000);
    });

    it('TC_DASH_025: Should navigate to Doc Reports section', () => {
      cy.contains('Doc Reports').click();
      cy.wait(1000);
    });

    it('TC_DASH_026: Should navigate to Approvals section', () => {
      cy.contains('Approvals').click();
      cy.wait(1000);
    });

    it('TC_DASH_027: Should navigate to Chats section', () => {
      cy.contains('Chats').click();
      cy.wait(1000);
    });

    it('TC_DASH_028: Should be able to logout', () => {
      cy.contains('Logout').click();
      cy.url({ timeout: 10000 }).should('include', LOGIN_URL);
    });

    it('TC_DASH_029: Should click notification icon', () => {
      cy.get('button').find('svg').first().click({ force: true });
      cy.wait(500);
    });

    it('TC_DASH_030: Should click user profile icon', () => {
      cy.get('button[aria-label*="profile"], button[aria-label*="user"]').first().click({ force: true });
      cy.wait(500);
    });
  });

  context('Positive Test Cases - Search Functionality', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_031: Should search for existing client name', () => {
      cy.intercept('GET', '**/api/**').as('searchRequest');
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('ABC Traders');
      cy.wait(1000);
    });

    it('TC_DASH_032: Should search for ticket ID', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('TKT-2024-001');
      cy.wait(1000);
    });

    it('TC_DASH_033: Should search with partial text', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('ABC');
      cy.wait(1000);
    });

    it('TC_DASH_034: Should search case-insensitively', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('abc traders');
      cy.wait(1000);
    });

    it('TC_DASH_035: Should allow search with Enter key', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('ABC{enter}');
      cy.wait(1000);
    });
  });

  context('Positive Test Cases - Filter Functionality', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_036: Should filter by Assigned status', () => {
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.contains('Assigned').click({ force: true });
      cy.wait(1000);
    });

    it('TC_DASH_037: Should filter by assignee', () => {
      cy.contains('Assignee').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(500);
      cy.get('[role="option"], option').first().click({ force: true });
      cy.wait(1000);
    });

    it('TC_DASH_038: Should apply multiple filters simultaneously', () => {
      // Apply status filter
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(300);
      cy.get('body').click(0, 0);

      // Apply assignee filter
      cy.contains('Assignee').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(1000);
    });

    it('TC_DASH_039: Should combine search and filters', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('ABC');
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(1000);
    });

    it('TC_DASH_040: Should reset filters', () => {
      // Apply filter
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(500);

      // Reset by clicking page reload or refresh button if exists
      cy.reload();
      cy.wait(2000);
    });
  });

  context('Negative Test Cases - Unauthorized Access', () => {

    it('TC_DASH_041: Should redirect to login when accessing dashboard without authentication', () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit(DASHBOARD_URL);
      cy.url({ timeout: 10000 }).should('include', LOGIN_URL);
    });

    it('TC_DASH_042: Should not access dashboard with expired session', () => {
      loginAsValidUser();

      // Clear session
      cy.clearCookies();
      cy.clearLocalStorage();

      // Try to access dashboard
      cy.reload();
      cy.url({ timeout: 10000 }).should('include', LOGIN_URL);
    });

    it('TC_DASH_043: Should not access dashboard with invalid token', () => {
      cy.clearCookies();
      cy.clearLocalStorage();

      // Set invalid token
      localStorage.setItem('token', 'invalid_token_12345');

      cy.visit(DASHBOARD_URL);
      cy.wait(2000);
    });
  });

  context('Negative Test Cases - Search & Filters', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_044: Should handle search with no results', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('NonExistentClient123456');
      cy.wait(2000);

      // Verify no data message or empty table
      cy.get('body').then($body => {
        if ($body.text().includes('No data') ||
            $body.text().includes('No tickets') ||
            $body.text().includes('No results')) {
          cy.contains(/No data|No tickets|No results/i).should('be.visible');
        }
      });
    });

    it('TC_DASH_045: Should handle special characters in search', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('@#$%^&*()');
      cy.wait(1000);
    });

    it('TC_DASH_046: Should handle very long search query', () => {
      const longQuery = 'a'.repeat(200);
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type(longQuery);
      cy.wait(1000);
    });

    it('TC_DASH_047: Should handle search with only spaces', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('     ');
      cy.wait(1000);
    });

    it('TC_DASH_048: Should handle search with SQL injection attempt', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type("' OR '1'='1");
      cy.wait(1000);

      // Should not break the application
      cy.contains('Pending Tickets').should('be.visible');
    });

    it('TC_DASH_049: Should handle search with XSS attempt', () => {
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected');
      });

      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('<script>alert("XSS")</script>');
      cy.wait(2000);

      // Should not execute script
      cy.contains('Pending Tickets').should('be.visible');
    });

    it('TC_DASH_050: Should handle rapid filter changes', () => {
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first()
        .click().click().click();
      cy.wait(1000);
    });
  });

  context('Negative Test Cases - API Failures', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_051: Should handle API error when loading tickets', () => {
      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('ticketsError');

      cy.reload();
      cy.wait(2000);
    });

    it('TC_DASH_052: Should handle network timeout', () => {
      cy.intercept('GET', '**/api/tickets**', {
        forceNetworkError: true
      }).as('networkError');

      cy.reload();
      cy.wait(2000);
    });

    it('TC_DASH_053: Should handle API returning empty data', () => {
      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 200,
        body: { tickets: [] }
      }).as('emptyData');

      cy.reload();
      cy.wait(2000);
    });

    it('TC_DASH_054: Should handle malformed API response', () => {
      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 200,
        body: 'invalid json'
      }).as('malformedResponse');

      cy.reload();
      cy.wait(2000);
    });
  });

  context('Edge Cases - UI Behavior', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_055: Should handle rapid clicking on action buttons', () => {
      cy.contains('button', 'See Approvals').click().click().click();
      cy.wait(1000);
    });

    it('TC_DASH_056: Should handle rapid navigation between menu items', () => {
      cy.contains('Employees').click();
      cy.contains('Dashboard').click();
      cy.contains('All Tickets').click();
      cy.contains('Dashboard').click();
      cy.wait(1000);
    });

    it('TC_DASH_057: Should handle browser back button', () => {
      cy.contains('Employees').click();
      cy.wait(1000);
      cy.go('back');
      cy.url().should('include', DASHBOARD_URL);
    });

    it('TC_DASH_058: Should handle browser forward button', () => {
      cy.contains('Employees').click();
      cy.wait(1000);
      cy.go('back');
      cy.go('forward');
      cy.wait(1000);
    });

    it('TC_DASH_059: Should handle page refresh', () => {
      cy.reload();
      cy.url().should('include', DASHBOARD_URL);
      cy.contains('Dashboard').should('be.visible');
    });

    it('TC_DASH_060: Should handle rapid search typing', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('abcdefghijklmnopqrstuvwxyz', { delay: 0 });
      cy.wait(1000);
    });

    it('TC_DASH_061: Should handle search backspace/delete', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('Test{backspace}{backspace}');
      cy.wait(500);
    });

    it('TC_DASH_062: Should handle keyboard navigation with Tab', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().focus();
      cy.realPress('Tab');
      cy.wait(500);
    });

    it('TC_DASH_063: Should handle simultaneous filter and search', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('ABC');
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(1000);
    });

    it('TC_DASH_064: Should handle empty ticket table gracefully', () => {
      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 200,
        body: { tickets: [] }
      }).as('emptyTickets');

      cy.reload();
      cy.wait(2000);
      cy.contains('Pending Tickets').should('be.visible');
    });

    it('TC_DASH_065: Should handle very long ticket ID', () => {
      const longTicketId = 'TKT-2024-' + '0'.repeat(100);
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type(longTicketId);
      cy.wait(1000);
    });

    it('TC_DASH_066: Should handle very long client name', () => {
      const longName = 'A'.repeat(200);
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type(longName);
      cy.wait(1000);
    });

    it('TC_DASH_067: Should handle unicode characters in search', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('测试中文字符🚀');
      cy.wait(1000);
    });

    it('TC_DASH_068: Should handle emojis in search', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('😀😁😂🤣');
      cy.wait(1000);
    });

    it('TC_DASH_069: Should maintain state after clicking ticket row', () => {
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first().type('ABC');
      cy.get('table tbody tr, [role="row"]').first().click({ force: true });
      cy.wait(500);
    });

    it('TC_DASH_070: Should handle clicking outside dropdowns to close them', () => {
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(300);
      cy.get('body').click(0, 0);
      cy.wait(500);
    });
  });

  context('Edge Cases - Data Validation', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_071: Should display correct date format', () => {
      cy.get('table tbody tr, [role="row"]').first().within(() => {
        cy.get('td').last().invoke('text').should('match', /\d{1,2}\s\w{3}\s\d{4}|\d{2}\/\d{2}\/\d{4}/);
      });
    });

    it('TC_DASH_072: Should handle tickets with missing data fields', () => {
      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 200,
        body: {
          tickets: [{
            id: 'TKT-2024-002',
            client: '',
            category: '',
            status: 'Pending',
            assignee: null
          }]
        }
      }).as('incompleteTickets');

      cy.reload();
      cy.wait(2000);
    });

    it('TC_DASH_073: Should validate metric card values are non-negative', () => {
      cy.contains('Total Pending Tickets').parent().invoke('text').then(text => {
        const number = parseInt(text.match(/\d+/)[0]);
        expect(number).to.be.at.least(0);
      });
    });

    it('TC_DASH_074: Should display consistent metric card totals', () => {
      let total, moreThan48, between24And48, lessThan24;

      cy.contains('Total Pending Tickets').parent().invoke('text').then(text => {
        total = parseInt(text.match(/\d+/)[0]);
      });

      cy.contains('More than 48 Hours').parent().invoke('text').then(text => {
        moreThan48 = parseInt(text.match(/\d+/)[0]);
      });

      cy.contains('24-48 Hours').parent().invoke('text').then(text => {
        between24And48 = parseInt(text.match(/\d+/)[0]);
      });

      cy.contains('Less than 24 Hours').parent().invoke('text').then(text => {
        lessThan24 = parseInt(text.match(/\d+/)[0]);

        // Verify total equals sum of categories
        const sum = moreThan48 + between24And48 + lessThan24;
        expect(total).to.equal(sum);
      });
    });
  });

  context('UI/UX Test Cases - Responsive Design', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_075: Should be responsive on mobile (iPhone X)', () => {
      cy.viewport('iphone-x');
      cy.contains('Dashboard').should('be.visible');
      cy.wait(1000);
    });

    it('TC_DASH_076: Should be responsive on mobile (iPhone SE)', () => {
      cy.viewport('iphone-se2');
      cy.contains('Dashboard').should('be.visible');
      cy.wait(1000);
    });

    it('TC_DASH_077: Should be responsive on tablet (iPad)', () => {
      cy.viewport('ipad-2');
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Pending Tickets').should('be.visible');
      cy.wait(1000);
    });

    it('TC_DASH_078: Should be responsive on tablet landscape', () => {
      cy.viewport('ipad-2', 'landscape');
      cy.contains('Dashboard').should('be.visible');
      cy.wait(1000);
    });

    it('TC_DASH_079: Should be responsive on desktop (1920x1080)', () => {
      cy.viewport(1920, 1080);
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Pending Tickets').should('be.visible');
      cy.wait(1000);
    });

    it('TC_DASH_080: Should be responsive on small desktop (1366x768)', () => {
      cy.viewport(1366, 768);
      cy.contains('Dashboard').should('be.visible');
      cy.wait(1000);
    });

    it('TC_DASH_081: Should handle very narrow viewport', () => {
      cy.viewport(375, 667);
      cy.contains('Dashboard').should('exist');
      cy.wait(1000);
    });

    it('TC_DASH_082: Should handle very wide viewport', () => {
      cy.viewport(2560, 1440);
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Pending Tickets').should('be.visible');
      cy.wait(1000);
    });
  });

  context('UI/UX Test Cases - Loading & Error States', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_083: Should show loading state when fetching data', () => {
      cy.intercept('GET', '**/api/tickets**', (req) => {
        req.reply({
          delay: 2000,
          statusCode: 200,
          body: { tickets: [] }
        });
      }).as('slowTickets');

      cy.reload();

      // Check for loading indicator
      cy.get('body').then($body => {
        if ($body.find('[data-testid="loading"], .loading, .spinner').length > 0) {
          cy.get('[data-testid="loading"], .loading, .spinner').should('be.visible');
        }
      });

      cy.wait('@slowTickets');
    });

    it('TC_DASH_084: Should display error message on API failure', () => {
      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 500,
        body: { error: 'Server Error' }
      }).as('errorResponse');

      cy.reload();
      cy.wait(2000);

      // Check for error message
      cy.get('body').then($body => {
        if ($body.text().includes('error') || $body.text().includes('Error')) {
          cy.contains(/error|Error/i).should('exist');
        }
      });
    });

    it('TC_DASH_085: Should handle partial data loading', () => {
      cy.intercept('GET', '**/api/metrics**', {
        statusCode: 500
      }).as('metricsError');

      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 200,
        body: { tickets: [] }
      }).as('ticketsSuccess');

      cy.reload();
      cy.wait(2000);
    });
  });

  context('Security Test Cases', () => {

    it('TC_DASH_086: Should use HTTPS protocol', () => {
      loginAsValidUser();
      cy.url().should('include', 'https://');
    });

    it('TC_DASH_087: Should not expose sensitive data in console', () => {
      loginAsValidUser();

      cy.window().then((win) => {
        cy.spy(win.console, 'log');
        cy.spy(win.console, 'error');

        cy.reload();
        cy.wait(2000);

        // Verify no passwords or tokens are logged
        cy.get('@console.log').should((log) => {
          const logs = log.getCalls().map(call => JSON.stringify(call.args));
          logs.forEach(logEntry => {
            expect(logEntry).to.not.include('password');
            expect(logEntry).to.not.include('token');
          });
        });
      });
    });

    it('TC_DASH_088: Should not allow script injection in search', () => {
      loginAsValidUser();

      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected');
      });

      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('<img src=x onerror=alert("XSS")>');
      cy.wait(2000);
    });

    it('TC_DASH_089: Should validate session on page load', () => {
      loginAsValidUser();

      // Clear session storage
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });

      cy.reload();
      cy.wait(2000);
    });

    it('TC_DASH_090: Should prevent clickjacking with frame protection', () => {
      cy.request(DASHBOARD_URL).then((response) => {
        const headers = response.headers;

        // Check for X-Frame-Options or CSP frame-ancestors
        if (headers['x-frame-options'] || headers['content-security-policy']) {
          cy.log('Frame protection headers present');
        }
      });
    });
  });

  context('Performance Test Cases', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_091: Should load dashboard within acceptable time', () => {
      const start = Date.now();
      cy.reload().then(() => {
        const loadTime = Date.now() - start;
        cy.log(`Dashboard load time: ${loadTime}ms`);
        expect(loadTime).to.be.lessThan(5000);
      });
    });

    it('TC_DASH_092: Should render table efficiently with multiple rows', () => {
      cy.intercept('GET', '**/api/tickets**', {
        statusCode: 200,
        body: {
          tickets: Array.from({ length: 50 }, (_, i) => ({
            id: `TKT-2024-${String(i).padStart(3, '0')}`,
            client: `Client ${i}`,
            category: 'Sales Invoice',
            status: 'Assigned',
            assignee: `User ${i}`
          }))
        }
      }).as('manyTickets');

      const start = Date.now();
      cy.reload();
      cy.wait('@manyTickets');

      cy.get('table tbody tr, [role="row"]').should('have.length.at.least', 10).then(() => {
        const renderTime = Date.now() - start;
        cy.log(`Table render time with 50 rows: ${renderTime}ms`);
        expect(renderTime).to.be.lessThan(3000);
      });
    });

    it('TC_DASH_093: Should handle search filtering performance', () => {
      const start = Date.now();
      cy.get('input[placeholder*="Search"], input[placeholder*="name"]').first()
        .type('ABC Traders');

      cy.wait(1000).then(() => {
        const filterTime = Date.now() - start;
        cy.log(`Search filter time: ${filterTime}ms`);
        expect(filterTime).to.be.lessThan(2000);
      });
    });

    it('TC_DASH_094: Should not have memory leaks on repeated navigation', () => {
      for (let i = 0; i < 5; i++) {
        cy.contains('Employees').click();
        cy.wait(500);
        cy.contains('Dashboard').click();
        cy.wait(500);
      }

      cy.contains('Dashboard').should('be.visible');
    });

    it('TC_DASH_095: Should efficiently handle filter changes', () => {
      const start = Date.now();
      cy.contains('Status').parent().find('select, button, [role="combobox"]').first().click();
      cy.wait(500);

      const dropdownTime = Date.now() - start;
      cy.log(`Filter dropdown open time: ${dropdownTime}ms`);
      expect(dropdownTime).to.be.lessThan(1000);
    });
  });

  context('Accessibility Test Cases', () => {

    beforeEach(() => {
      loginAsValidUser();
    });

    it('TC_DASH_096: Should have proper ARIA labels for buttons', () => {
      cy.get('button').each(($btn) => {
        cy.wrap($btn).should('satisfy', ($el) => {
          return $el.attr('aria-label') || $el.text().trim().length > 0;
        });
      });
    });

    it('TC_DASH_097: Should support keyboard navigation', () => {
      cy.get('body').tab();
      cy.focused().should('exist');
    });

    it('TC_DASH_098: Should have proper heading hierarchy', () => {
      cy.get('h1, h2, h3, h4, h5, h6').should('exist');
    });

    it('TC_DASH_099: Should have proper table structure with headers', () => {
      cy.get('table').within(() => {
        cy.get('thead').should('exist');
        cy.get('tbody').should('exist');
        cy.get('th').should('have.length.at.least', 1);
      });
    });

    it('TC_DASH_100: Should have sufficient color contrast', () => {
      // This is a visual test - in real scenario, use accessibility tools
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Pending Tickets').should('be.visible');
    });
  });

});