describe("Home Page", () => {
  context("Title - AB Testing", () => {
    const testTitleA = "Test title A";
    const testTitleB = "Test title B";
    const testResponse = (title) => ({
      flags: [
        {
          feature: {
            type: "MULTIVARIATE",
            id: 32139,
            name: "landing_page_copy",
          },
          enabled: true,
          feature_state_value: title,
        },
      ],
      traits: [],
    });

    it("render test title A", () => {
      cy.intercept(
        {
          method: "GET",
          url: "https://edge.api.flagsmith.com/api/v1/**",
        },
        testResponse(testTitleA)
      ).as("init_session");

      cy.visit("/");

      cy.wait("@init_session").then(() => {
        cy.get("h1").first().should("have.text", testTitleA);
      });
    });

    it("render test title B", () => {
      cy.intercept(
        {
          method: "GET",
          url: "https://edge.api.flagsmith.com/api/v1/**",
        },
        testResponse(testTitleB)
      ).as("init_session");

      cy.visit("/");

      cy.wait("@init_session").then(() => {
        cy.get("h1").first().should("have.text", testTitleB);
      });
    });
  });
});
