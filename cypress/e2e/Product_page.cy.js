describe("Product Page", () => {
  context("Test product render", () => {
    beforeEach(() => {
      const testResponse = {
        data: {
          id: 1, // the id must exist in the database, on the contrary the url will redirect to the 404 page
          name: "Test product",
          description: "Test description",
          created_at: "2021-09-14T20:31:15.133Z",
          updated_at: "2021-09-14T20:31:15.133Z",
          deleted_at: null,
          images: [
            {
              id: 322,
              public_id: "proveat/prod/images/t6zti2ubb5lpyjr0q7nz",
            },
          ],
          videos: [],
          images_count: 1,
          videos_count: 0,
          price: 8,
          tags: [],
          likes_count: 0,
        },
      };
      cy.intercept(
        {
          method: "GET",
          url: "/api/v1/product/*",
        },
        testResponse
      ).as("get_product");

      cy.visit(`/shop/shop/product/${testResponse.data.id}`);
    });

    it("render product", () => {
      cy.wait("@get_product").then(() => {
        cy.get(".img").should("be.visible");
        cy.get(".description").should("be.visible");
      });
    });

    it("render product image", () => {
      cy.wait("@get_product").then(($interception) => {
        const testProduct = $interception.response.body.data;
        cy.get(".img")
          .should("have.attr", "src")
          .should("include", testProduct.images[0].public_id);
      });
    });

    it("render product name", () => {
      cy.wait("@get_product").then(($interception) => {
        const testProduct = $interception.response.body.data;
        cy.get(".description h1").contains(testProduct.name);
      });
    });

    it("render product description", () => {
      cy.wait("@get_product").then(($interception) => {
        const testProduct = $interception.response.body.data;
        cy.get(".description p").contains(testProduct.description);
      });
    });

    it("render product price", () => {
      cy.wait("@get_product").then(($interception) => {
        const testProduct = $interception.response.body.data;
        cy.get(".description .price").contains(testProduct.price);
      });
    });
  });
});
