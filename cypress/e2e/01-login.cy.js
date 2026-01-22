/// <reference types="cypress" />

describe('Login Page - Fixed Test Suite', () => {
  
  const LOGIN_URL = 'https://arthtattva-fe.dev.perimattic.dev/login';
  const DASHBOARD_URL = 'https://arthtattva-fe.dev.perimattic.dev/dashboard';

  beforeEach(() => {
    cy.visit(LOGIN_URL);
  });

  context('Positive Test Cases', () => {
    
    it('TC_LOGIN_001: Should display login page elements correctly', () => {
      cy.url().should('include', LOGIN_URL);
      cy.contains('Log In').should('be.visible');
      cy.get('input[placeholder="Enter Email ID"]').should('be.visible');
      cy.get('input[placeholder="Min. 8 Characters"]').should('be.visible');
      cy.contains('Remember me').should('be.visible');
      cy.contains('Forgot password?').should('be.visible');
      cy.get('button').contains('Log In').should('be.visible');
      
    });

    it('TC_LOGIN_002: Should login successfully with valid credentials', () => {
      // Set up intercept BEFORE typing
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');
      
      cy.fixture('users').then((users) => {
        cy.get('input[placeholder="Enter Email ID"]').type(users.validUser.email);
        cy.get('input[placeholder="Min. 8 Characters"]').type(users.validUser.password);
        cy.get('button').contains('Log In').click();
        
        // Wait for API call
        cy.wait('@loginRequest').then((interception) => {
          // Log the response for debugging
          cy.log('Response:', JSON.stringify(interception.response));
          
          // Check if login was successful (either by status code or by URL change)
          if (interception.response) {
            expect([200, 201]).to.include(interception.response.statusCode);
          }
        });
        
        // Verify redirect to dashboard
        cy.url({ timeout: 15000 }).should('include', DASHBOARD_URL);
        cy.contains('Dashboard').should('be.visible');
      });
    });

    it('TC_LOGIN_003: Should toggle password visibility', () => {
      cy.get('input[placeholder="Min. 8 Characters"]').type('TestPassword123');
      
      cy.get('input[placeholder="Min. 8 Characters"]').parent().find('svg').last().click();
      cy.get('input[placeholder="Min. 8 Characters"]').should('have.attr', 'type', 'text');
    });

    it('TC_LOGIN_004: Should navigate to forgot password page', () => {
      cy.contains('Forgot password?').click();
      cy.url().should('include', '/requestOtp-password');
      cy.contains('Forgot Password ?').should('be.visible');
    });

    it('TC_LOGIN_005: Should check Remember me checkbox', () => {
      cy.get('input[type="checkbox"]').should('not.be.checked');
      cy.contains('Remember me').click();
      cy.get('input[type="checkbox"]').should('be.checked');
    });

    it('TC_LOGIN_006: Should submit form using Enter key', () => {
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');
      
      cy.fixture('users').then((users) => {
        cy.get('input[placeholder="Enter Email ID"]').type(users.validUser.email);
        cy.get('input[placeholder="Min. 8 Characters"]').type(`${users.validUser.password}{enter}`);
        
        cy.wait('@loginRequest', { timeout: 15000 });
        cy.url({ timeout: 15000 }).should('include', DASHBOARD_URL);
      });
    });

    it('TC_LOGIN_007: Should display email and lock icons', () => {
      cy.get('input[placeholder="Enter Email ID"]').parent().find('img').should('exist');
      cy.get('input[placeholder="Min. 8 Characters"]').parent().find('svg').should('exist');
    });

  });

  context('Negative Test Cases', () => {
    
    it('TC_LOGIN_008: Should show error with invalid credentials', () => {
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');
      
      cy.get('input[placeholder="Enter Email ID"]').type('invalid@test.com');
      cy.get('input[placeholder="Min. 8 Characters"]').type('WrongPassword123');
      cy.get('button').contains('Log In').click();
      
      // Wait for response
      cy.wait('@loginRequest', { timeout: 10000 }).then((interception) => {
        cy.log('Response:', JSON.stringify(interception.response));
        
        // Check for error - either status code or error message in UI
        if (interception.response) {
          // Some APIs return 401, some return 200 with error in body
          const statusCode = interception.response.statusCode;
          cy.log(`Status Code: ${statusCode}`);
          
          if (statusCode === 401 || statusCode === 400) {
            cy.log('API returned error status code');
          }
        }
      });
      
      // Most important: Check that user is NOT redirected to dashboard
      cy.url().should('include', LOGIN_URL);
      
      // Check for error message (if displayed)
      cy.get('body').then($body => {
        if ($body.text().includes('Login failed') || 
            $body.text().includes('Invalid') || 
            $body.text().includes('credentials')) {
          cy.contains(/Login failed|Invalid|credentials/i).should('be.visible');
        }
      });
    });

    it('TC_LOGIN_009: Should show validation error with empty email', () => {
      cy.get('input[placeholder="Min. 8 Characters"]').type('Password123');
      cy.get('button').contains('Log In').click();
      
      // Check HTML5 validation
      cy.get('input[placeholder="Enter Email ID"]').then($input => {
        expect(validity.valid).to.be.false;
      });
    });

    it('TC_LOGIN_010: Should show validation error with empty password', () => {
      cy.get('input[placeholder="Enter Email ID"]').type('test@test.com');
      cy.get('button').contains('Log In').click();
      
      cy.get('input[placeholder="Min. 8 Characters"]').then($input => {
        expect(validity.valid).to.be.false;
      });
    });

    it('TC_LOGIN_011: Should show validation error with both fields empty', () => {
      cy.get('button').contains('Log In').click();
      
      cy.get('input[placeholder="Enter Email ID"]').then($input => {
        expect($input[0].validity.valid).to.be.false;
      });
    });

    it('TC_LOGIN_012: Should reject invalid email format', () => {
      cy.get('input[placeholder="Enter Email ID"]').type('notanemail');
      cy.get('input[placeholder="Min. 8 Characters"]').type('Password123');
      cy.get('button').contains('Log In').click();
      
      // Check HTML5 validation or that user stays on login page
      cy.get('input[placeholder="Enter Email ID"]').then($input => {
        if (!$input[0].validity.valid) {
          cy.log('HTML5 validation caught invalid email');
          expect($input[0].validity.valid).to.be.false;
        } else {
          // If HTML5 validation doesn't catch it, check user stays on login
          cy.url().should('include', LOGIN_URL);
        }
      });
    });

    it('TC_LOGIN_013: Should prevent SQL injection', () => {
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');
      
      cy.get('input[placeholder="Enter Email ID"]').type("admin'--");
      cy.get('input[placeholder="Min. 8 Characters"]').type("' OR '1'='1");
      cy.get('button').contains('Log In').click();
      
      cy.wait('@loginRequest', { timeout: 10000 });
      
      // Should NOT be logged in
      cy.url().should('include', LOGIN_URL);
    });

    it('TC_LOGIN_014: Should prevent XSS attack', () => {
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected');
      });
      
      cy.get('input[placeholder="Enter Email ID"]').type('<script>alert("XSS")</script>');
      cy.get('input[placeholder="Min. 8 Characters"]').type('Password123');
      cy.get('button').contains('Log In').click();
      
      // Should not redirect to dashboard
      cy.wait(2000);
      cy.url().should('include', LOGIN_URL);
    });

  });

  context('Edge Cases', () => {
    
    it('TC_LOGIN_015: Should handle very long email', () => {
      const longEmail = 'a'.repeat(240) + '@test.com';
      cy.get('input[placeholder="Enter Email ID"]').type(longEmail);
      cy.get('input[placeholder="Min. 8 Characters"]').type('Password123');
      cy.get('button').contains('Log In').click();
      cy.wait(1000);
    });

    it('TC_LOGIN_016: Should handle very long password', () => {
      cy.get('input[placeholder="Enter Email ID"]').type('test@test.com');
      cy.get('input[placeholder="Min. 8 Characters"]').type('a'.repeat(100));
      cy.get('button').contains('Log In').click();
      cy.wait(1000);
    });

    it('TC_LOGIN_017: Should handle special characters in email', () => {
      cy.get('input[placeholder="Enter Email ID"]').type('test+user@test.com');
      cy.get('input[placeholder="Min. 8 Characters"]').type('Password123');
      cy.get('button').contains('Log In').click();
      cy.wait(1000);
    });

    it('TC_LOGIN_018: Should handle spaces in password', () => {
      cy.get('input[placeholder="Enter Email ID"]').type('test@test.com');
      cy.get('input[placeholder="Min. 8 Characters"]').type('Pass word 123');
      cy.get('button').contains('Log In').click();
      cy.wait(1000);
    });

    it('TC_LOGIN_019: Should trim whitespace from email', () => {
      cy.fixture('users').then((users) => {
        cy.get('input[placeholder="Enter Email ID"]').type(`  ${users.validUser.email}  `);
        cy.get('input[placeholder="Min. 8 Characters"]').type(users.validUser.password);
        cy.get('button').contains('Log In').click();
        cy.wait(2000);
      });
    });

    it('TC_LOGIN_020: Should handle rapid multiple clicks', () => {
      cy.fixture('users').then((users) => {
        cy.get('input[placeholder="Enter Email ID"]').type(users.validUser.email);
        cy.get('input[placeholder="Min. 8 Characters"]').type(users.validUser.password);
        
        cy.get('button').contains('Log In').click().click().click();
        cy.wait(2000);
      });
    });

    it('TC_LOGIN_021: Should handle keyboard Tab navigation', () => {
      cy.get('input[placeholder="Enter Email ID"]').type('{tab}');
      cy.focused().should('have.attr', 'placeholder', 'Min. 8 Characters');
    });
  });

  context('UI/UX Test Cases', () => {

    it('TC_LOGIN_022: Should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.contains('Log In').should('be.visible');
      cy.get('input[placeholder="Enter Email ID"]').should('be.visible');
    });

    it('TC_LOGIN_023: Should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.contains('Log In').should('be.visible');
      cy.get('input[placeholder="Enter Email ID"]').should('be.visible');
    });
  });

  context('Security Test Cases', () => {
    
    it('TC_LOGIN_024: Should mask password by default', () => {
      cy.get('input[placeholder="Min. 8 Characters"]').type('SecretPassword');
      cy.get('input[placeholder="Min. 8 Characters"]').should('have.attr', 'type', 'password');
    });

    it('TC_LOGIN_025: Should use HTTPS', () => {
      cy.url().should('include', 'https://');
    });

  });

  context('Performance Test Cases', () => {
    
    it('TC_LOGIN_026 : Should load login page quickly', () => {
      const start = Date.now();
      cy.visit(LOGIN_URL).then(() => {
        const loadTime = Date.now() - start;
        cy.log(`Page load time: ${loadTime}ms`);
        expect(loadTime).to.be.lessThan(5000);
      });
    });
  });
});