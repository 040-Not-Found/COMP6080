import { cyan } from "@mui/material/colors";

describe('user happy path', () => {
  it('open url', () => {
    cy.clearLocalStorage()
    cy.visit('http://localhost:3000')
    cy.url().should('include', 'http://localhost:3000')
  });

  it('should navigate to sign in page', () => {
    cy.url().should('include', 'signin')
  });

  it('click to sign up page', () => {
    cy.get('button[id="header-sign-up"]')
      .click();
    cy.url().should('include', 'signup')
  })

  it('sign up success and navigate to dashboard', () => {
    cy.get('input[id="email-input"]')
      .focus()
      .type('test@email.com')
    cy.get('input[id="password-input"]')
      .focus()
      .type('password')
    cy.get('input[id="name-input"]')
      .focus()
      .type('name')
    cy.get('button[id="register-button"]')
      .click()
    cy.url().should('include', 'dashboard')
  })
  
  it('sign out', () => {
    cy.get('button[id="header-logout"]')
    .click();
    cy.url().should('include', 'signin')
  })

  it('login again', () => {
    cy.get('input[id="email-input"]')
      .focus()
      .type('test@email.com')
    cy.get('input[id="password-input"]')
      .focus()
      .type('password')
    cy.get('button[id="sign-in-button"]')
      .click()
    cy.url().should('include', 'dashboard')
  })

  it('create a new game', () => {
    cy.get('button[id="create-new-game-button"]')
      .click()
    cy.get('input[id="title-input"]')
      .focus()
      .type('Game 1')
    cy.get('button[id="create-button"]')
      .click()
    })
    
  it('detele a game', () => {
    cy.get('button[id="show-delete-button"]')
      .click()
    cy.get('button[id="delete-game-button"]')
      .first()
      .click()
  })

  it('create a new game', () => {
    cy.get('button[id="create-new-game-button"]')
      .click()
    cy.get('button[id="create-button"]')
      .click()
    })

  it('edit game', () => {
    cy.get('button[id="edit-game-button"]')
      .click()
    cy.url().should('include', 'game')
  })

  it('add question', () => {
    cy.get('button[id="add-question-button"]')
      .click()
    cy.get('input[id="question-input"]')
      .focus()
      .type('question 1')
    cy.get('input[id="time-input"]')
      .focus()
      .type('10')
    cy.get('input[id="points-input"]')
      .focus()
      .type('10')
    cy.get('input[id="answer-input"]')
      .focus()
      .type('answer 1')
    cy.get('button[id="add-button"]')
      .click()
  })

  it('delete question', () => {
    cy.get('button[id="delete-question-button"]')
      .first()
      .click()
  })

  it('add question', () => {
    cy.get('button[id="add-button"]')
      .click()
  })

  it('edit question', () => {
    cy.get('button[id="edit-question-button"]')
      .first()
      .click()
    cy.url().should('include', 'question')
    cy.get('input[id="question-input"]')
      .focus()
      .type('question 2')
    cy.get('input[id="time-input"]')
      .focus()
      .type('20')
    cy.get('input[id="points-input"]')
      .focus()
      .type('20')
    cy.get('input[id="answer-input"]')
      .focus()
      .type('answer 2')
    cy.get('button[id="update-button"]')
      .click()
  })

  it('return to dashboard', () => {
    cy.get('button[id="return-to-dashboard-button"]')
      .click()
    cy.url().should('include', 'dashboard')
  })

})