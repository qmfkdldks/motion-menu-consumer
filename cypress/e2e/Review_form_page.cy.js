import {
  storage_token_name,
  storage_expiration_date_name,
} from "../../src/stores/user_store";
import "../support/commands";

describe("Review form Page", () => {
  const TEST_COMPANY_ID = 201;

  const comment = "This is a test comment";
  const request_body = {
    review: {
      body: comment,
    },
  };
  const language = window.navigator.language.split(/[-_]/)[0]; // language without region code
  const test_token = "test_token";
  const test_expiration_date = "2050-01-01T00:00:00.000Z";

  beforeEach(() => {
    cy.visit(`/shop/${TEST_COMPANY_ID}/reviews/form`);
    cy.waitForPageLoad();
    cy.on("uncaught:exception", () => false); // ignore auth0 errors
  });

  context("when user submits the form", () => {
    it("when review is less than 3 characters, it should show an error message", () => {
      cy.get("[data-testid=submit-button]").should("be.visible");
      cy.get("textarea[name=comment]").should("be.visible").type("aa");

      cy.get("[data-testid=submit-button]").click();

      cy.get("[data-testid=error-message]").should("be.visible");
    });

    context("as a logged user", () => {
      beforeEach(() => {
        localStorage.setItem(storage_token_name, test_token);
        localStorage.setItem(
          storage_expiration_date_name,
          test_expiration_date
        );

        expect(localStorage.getItem(storage_token_name)).to.equal(test_token);
        expect(localStorage.getItem(storage_expiration_date_name)).to.equal(
          test_expiration_date
        );
      });

      it("should send the right request with params", () => {
        cy.intercept({
          method: "POST",
          url: "/api/v1/users/reviews",
        }).as("post_review");

        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);

        cy.get("[data-testid=submit-button]").click();

        cy.wait("@post_review").then((interception) => {
          expect(interception.request.body).to.deep.equal(request_body);
        });
      });

      it("if review is successfully created, it should redirect to the success page", () => {
        cy.intercept(
          {
            method: "POST",
            url: "/api/v1/users/reviews",
          },
          {
            statusCode: 201, // return 201 status code to simulate a successful review creation
          }
        ).as("post_review");

        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);

        cy.get("[data-testid=submit-button]").click();

        cy.wait("@post_review").then(() => {
          cy.url().should("include", "review/success");
        });
      });

      it("if review is not successfully created, it should not redirect to the success page", () => {
        cy.intercept(
          {
            method: "POST",
            url: "/api/v1/users/reviews",
          },
          {
            statusCode: 500, // return 500 status code to simulate a failed review creation
          }
        ).as("post_review");

        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);

        cy.get("[data-testid=submit-button]").click();

        cy.wait("@post_review").then(() => {
          cy.url().should("not.include", "review/success");
        });
      });
    });

    context("as an unauthenticated user", () => {
      it("auth0 popup should open", () => {
        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);
        cy.window().then((win) => {
          cy.stub(win, "open").returns({}).as("open"); // stub the popup
        });
        cy.get("[data-testid=submit-button]").click();
        cy.get("@open").should(
          // check if the popup was called correctly
          "have.been.calledWith",
          "",
          "auth0:authorize:popup"
        );
      });

      it("(after open popup) if review is successfully created, it should redirect to the success page", () => {
        cy.intercept(
          {
            method: "POST",
            url: "/api/v1/users/reviews",
          },
          {
            statusCode: 201, // return 201 status code to simulate a successful review creation
          }
        ).as("post_review");

        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);

        cy.window().then((win) => {
          cy.stub(win, "open").returns({}).as("open"); // stub the popup
        });

        cy.get("[data-testid=submit-button]").click();

        cy.get("@open").should("have.been.called"); // check if the popup was called

        cy.wait("@post_review").then(() => {
          cy.url().should("include", "review/success");
        });
      });

      it("(after open popup) if review is not successfully created, it should not redirect to the success page", () => {
        cy.intercept(
          {
            method: "POST",
            url: "/api/v1/users/reviews",
          },
          {
            statusCode: 500, // return 500 status code to simulate a failed review creation
          }
        ).as("post_review");

        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);

        cy.window().then((win) => {
          cy.stub(win, "open").returns({}).as("open"); // stub the popup
        });

        cy.get("[data-testid=submit-button]").click();

        cy.get("@open").should("have.been.called"); // check if the popup was called

        cy.wait("@post_review").then(() => {
          cy.url().should("not.include", "review/success");
        });
      });
    });

    context("notifying the user about the review creation status", () => {
      const success_message = "review_post_success_message";
      const error_message = "review_post_error_message";

      beforeEach(() => {
        localStorage.setItem(storage_token_name, "test_token");
        localStorage.setItem(
          storage_expiration_date_name,
          "2050-01-01T00:00:00.000Z"
        );
      });

      it("if review is successfully created, it should show a success message", () => {
        cy.intercept(
          {
            method: "POST",
            url: "/api/v1/users/reviews",
          },
          {
            statusCode: 201, // return 201 status code to simulate a successful review creation
          }
        ).as("post_review");

        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);

        cy.get("[data-testid=submit-button]").click();

        cy.wait("@post_review").then(() => {
          cy.readFile(`src/lib/translation/${language}.json`).then(
            (translation) => {
              cy.get("div[class*=toaster]").contains(
                translation[success_message]
              );
            }
          );
        });
      });

      it("if review is not successfully created, it should show an error message", () => {
        cy.intercept(
          {
            method: "POST",
            url: "/api/v1/users/reviews",
          },
          {
            statusCode: 500, // return 500 status code to simulate a failed review creation
          }
        ).as("post_review");

        cy.get("[data-testid=submit-button]").should("be.visible");
        cy.get("textarea[name=comment]").should("be.visible").type(comment);

        cy.get("[data-testid=submit-button]").click();

        cy.wait("@post_review").then(() => {
          cy.readFile(`src/lib/translation/${language}.json`).then(
            (translation) => {
              cy.get("div[class*=toaster]").contains(
                translation[error_message]
              );
            }
          );
        });
      });
    });
  });

  context("conditional text depending on the user authentication", () => {
    const button_text_logged = "share";
    const button_text_unlogged = "sign-up_to_share";
    const paragraph_text_unlogged = "sign-up_to_share_review";

    context("as a logged user", () => {
      beforeEach(() => {
        localStorage.setItem(storage_token_name, "test_token");
        localStorage.setItem(
          storage_expiration_date_name,
          "2050-01-01T00:00:00.000Z"
        );
      });

      it("submit button should have the right text", () => {
        cy.get("[data-testid=submit-button]").should("be.visible");

        cy.readFile(`src/lib/translation/${language}.json`).then(
          (translations) => {
            cy.get("[data-testid=submit-button]").contains(
              translations[button_text_logged]
            );
          }
        );
      });

      it("unauthentication message should not be visible", () => {
        cy.get("[data-testid=unauthenticated-message]").should(
          "not.be.visible"
        );
      });
    });

    context("as a unauthenticated user", () => {
      it("submit button should have the right text", () => {
        cy.get("[data-testid=submit-button]").should("be.visible");

        cy.readFile(`src/lib/translation/${language}.json`).then(
          (translations) => {
            cy.get("[data-testid=submit-button]").contains(
              translations[button_text_unlogged]
            );
          }
        );
      });

      it("unauthentication message should have the right text", () => {
        cy.get("[data-testid=unauthenticated-message]").should("be.visible");

        cy.readFile(`src/lib/translation/${language}.json`).then(
          (translations) => {
            cy.get("[data-testid=unauthenticated-message]").contains(
              translations[paragraph_text_unlogged]
            );
          }
        );
      });
    });
  });
});
