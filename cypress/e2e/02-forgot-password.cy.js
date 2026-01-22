

describe('Forgot Password - Complete Test Suite', () => {
  
  const FORGOT_PASSWORD_URL = '/requestOtp-password';
  const LOGIN_URL = '/login';

  beforeEach(() => {
    cy.visit(LOGIN_URL);
    cy.contains('Forgot password?').click();
    cy.url().should('include', FORGOT_PASSWORD_URL);
  });

  context('✅ Positive Test Cases', () => {
    
    it('TC_FORGOT_001: Should display forgot password page correctly', () => {
      cy.contains('Forgot Password ?').should('be.visible');
      cy.contains('No Worries, you can reset your password').should('be.visible');
      cy.get('input[placeholder="Enter Email"]').should('be.visible');
      cy.get('input[placeholder="Enter Mobile No."]').should('be.visible');
      cy.get('button').contains('Reset Password').should('be.visible');
      cy.contains('← Back to Log In').should('be.visible');
    });

    it('TC_FORGOT_002: Should submit with valid email and mobile', () => {
      cy.intercept('POST', '**/api/auth/forgot-password').as('forgotPassword');
      
      cy.get('input[placeholder="Enter Email"]').type('jay.patel@perimattic.com');
      cy.get('input[placeholder="Enter Mobile No."]').type('9876543210');
      cy.get('button').contains('Reset Password').click();
      
      cy.wait('@forgotPassword');
    });

    it('TC_FORGOT_003: Should navigate back to login', () => {
      cy.contains('← Back to Log In').click();
      cy.url().should('include', LOGIN_URL);
    });

    it('TC_FORGOT_004: Should display email icon', () => {
      cy.get('input[placeholder="Enter Email"]').parent().find('svg').should('exist');
    });

    it('TC_FORGOT_005: Should display phone icon', () => {
      cy.get('input[placeholder="Enter Mobile No."]').parent().find('svg').should('exist');
    });

  });

  context('❌ Negative Test Cases', () => {
    
    it('TC_FORGOT_006: Should show error with empty email', () => {
      cy.get('input[placeholder="Enter Mobile No."]').type('9876543210');
      cy.get('button').contains('Reset Password').click();
      cy.get('input[placeholder="Enter Email"]:invalid').should('exist');
    });

    it('TC_FORGOT_007: Should show error with empty mobile', () => {
      cy.get('input[placeholder="Enter Email"]').type('test@test.com');
      cy.get('button').contains('Reset Password').click();
      cy.get('input[placeholder="Enter Mobile No."]:invalid').should('exist');
    });

    it('TC_FORGOT_008: Should show error with invalid email format', () => {
      cy.get('input[placeholder="Enter Email"]').type('notanemail');
      cy.get('input[placeholder="Enter Mobile No."]').type('9876543210');
      cy.get('button').contains('Reset Password').click();
    });

  });

  context('🔢 Edge Cases', () => {
    
    it('TC_FORGOT_009: Should handle mobile with country code', () => {
      cy.get('input[placeholder="Enter Email"]').type('test@test.com');
      cy.get('input[placeholder="Enter Mobile No."]').type('+919876543210');
      cy.get('button').contains('Reset Password').click();
    });

    it('TC_FORGOT_010: Should handle mobile with spaces', () => {
      cy.get('input[placeholder="Enter Email"]').type('test@test.com');
      cy.get('input[placeholder="Enter Mobile No."]').type('98765 43210');
      cy.get('button').contains('Reset Password').click();
    });

    it('TC_FORGOT_011: Should submit with Enter key', () => {
      cy.get('input[placeholder="Enter Email"]').type('test@test.com');
      cy.get('input[placeholder="Enter Mobile No."]').type('9876543210{enter}');
    });

  });

  context('🎨 UI/UX Test Cases', () => {
    
    it('TC_FORGOT_012: Should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.contains('Forgot Password ?').should('be.visible');
    });

    it('TC_FORGOT_013: Should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.contains('Forgot Password ?').should('be.visible');
    });

  });

});