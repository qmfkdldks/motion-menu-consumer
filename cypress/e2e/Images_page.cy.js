describe("Images Page", () => {
  context("Products in images", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/v1/37/products?page=1&per_page=15").as(
        "get_products"
      );
      cy.visit("/shop/37");
    });

    it("render products", () => {
      cy.wait("@get_products").then(() => {
        cy.get("#list-masonry > .card").should("not.have.length", 0);
      });
    });
  });
});
