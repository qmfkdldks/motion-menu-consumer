import "../support/commands";

describe("Landing Page", () => {
  beforeEach(() => {
    cy.visit("/landing");
    cy.on("uncaught:exception", () => false); // ignore errors
    cy.waitForPageLoad();
    cy.wait(1000); // wait for page to load
  });

  const invalid_email_message = "Email must be a valid email address";
  const length_email_message = "Email must be between 5 and 100 characters";
  const email_taken_message = "Email has already been taken";
  const length_password_message =
    "Password must be between 5 and 100 characters";
  const password_confirmation_error_message =
    "Password confirmation doesn't match password";

  context("Sign up form", () => {
    it("shows error messages when fields are empty", () => {
      cy.get("[data-testid=submit-button]").click();
      cy.contains(length_email_message).should("be.visible");
      cy.contains(length_password_message).should("be.visible");
    });

    it("shows error message when email is invalid", () => {
      cy.get("[data-testid=sign-up-form]")
        .find('[id="email"]')
        .type("trial1@")
        .blur();

      cy.contains(invalid_email_message).should("be.visible");
    });

    it("shows error message when password is too short", () => {
      cy.get("[data-testid=sign-up-form]")
        .find('[id="password"]')
        .type("pass")
        .blur();

      cy.contains(length_password_message).should("be.visible");
    });

    it("shows error message when password confirmation doesn't match", () => {
      cy.get("[data-testid=sign-up-form]")
        .find('[id="password"]')
        .type("password1234");

      cy.get("[data-testid=sign-up-form]")
        .find('[id="password_confirmation"]')
        .type("password12345")
        .blur();

      cy.contains(password_confirmation_error_message).should("be.visible");
    });

    it("shows error message when email is already taken", () => {
      cy.intercept("POST", "/api/v1/companies/auth").as("sign_up");

      cy.get("[data-testid=sign-up-form]")
        .find('[id="email"]')
        .type("trial1@mail.com");
      cy.get("[data-testid=sign-up-form]")
        .find('[id="password"]')
        .type("password1234");
      cy.get("[data-testid=sign-up-form]")
        .find('[id="password_confirmation"]')
        .type("password1234");
      cy.get("[data-testid=submit-button]").click();

      cy.wait("@sign_up");
      cy.contains(email_taken_message).should("be.visible");
    });
  });

  context("After sign up", () => {
    it("navigates to profiling page", () => {
      cy.intercept("POST", "/api/v1/companies/auth").as("sign_up");

      const random_mail = Math.random().toString(36).substring(7);

      cy.get("[data-testid=sign-up-form]")
        .find('[id="email"]')
        .type(`${random_mail + "@mail.com"}`);
      cy.get("[data-testid=sign-up-form]")
        .find('[id="password"]')
        .type("password1234");
      cy.get("[data-testid=sign-up-form]")
        .find('[id="password_confirmation"]')
        .type("password1234");
      cy.get("[data-testid=submit-button]").click();

      cy.wait("@sign_up");
      cy.wait(1000); // wait for the page to load
      cy.url().should("include", "/profiling");
    });
  });

  context("Google sign in", () => {
    it("button is visible", () => {
      cy.get("[data-testid=google-sign-in]").should("be.visible");
    });
  });

  context('"Success cases" section', () => {
    it("shows the carrousel", () => {
      cy.get("[data-testid=success-cases-carrousel]").should("be.visible");
    });
  });
});
