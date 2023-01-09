describe("Menu Page", () => {
  context("Products list with likes (test response)", () => {
    const testLikes = 3;

    beforeEach(() => {
      const testResponse = {
        data: {
          1: {
            id: 1,
            name: "Test product",
            description: "",
            created_at: "2021-09-14T20:31:15.133Z",
            updated_at: "2021-09-14T20:31:15.133Z",
            deleted_at: null,
            images: [],
            videos: [],
            images_count: 0,
            videos_count: 0,
            price: 0,
            tags: [],
            likes_count: testLikes,
          },
        },
        meta: {
          vars: {
            page: "2",
            items: 15,
            outset: 0,
            size: [1, 4, 4, 1],
            page_param: "page",
            params: {},
            anchor: "",
            link_extra: "",
            i18n_key: "pagy.item_name",
            cycle: false,
            steps: false,
            items_param: "per_page",
            max_items: 100,
            count: 21,
          },
          count: 21,
          items: 6,
          outset: 0,
          page: 2,
          last: 2,
          pages: 2,
          offset: 15,
          from: 16,
          to: 21,
          prev: 1,
          next: null,
        },
      };
      cy.intercept(
        {
          method: "GET",
          url: "/api/v1/shop/products*",
        },
        testResponse
      ).as("get_products");

      cy.visit("/shop/shop");
    });

    it("render likes", () => {
      cy.wait("@get_products").then(() => {
        cy.get(".like-container > .likes-count").contains(testLikes);
      });
    });
    it("render icon liked", () => {
      cy.wait("@get_products").then(() => {
        cy.get(".like-container > .icon").last().click();
        cy.get(".like-container > .icon").should("have.class", "liked");
      });
    });
  });

  context("Products list without likes (test response)", () => {
    const testLikes = 0;

    beforeEach(() => {
      const testResponse = {
        data: {
          1: {
            id: 1,
            name: "Test product",
            description: "",
            created_at: "2021-09-14T20:31:15.133Z",
            updated_at: "2021-09-14T20:31:15.133Z",
            deleted_at: null,
            images: [],
            videos: [],
            images_count: 0,
            videos_count: 0,
            price: 0,
            tags: [],
            likes_count: testLikes,
          },
        },
        meta: {
          vars: {
            page: "2",
            items: 15,
            outset: 0,
            size: [1, 4, 4, 1],
            page_param: "page",
            params: {},
            anchor: "",
            link_extra: "",
            i18n_key: "pagy.item_name",
            cycle: false,
            steps: false,
            items_param: "per_page",
            max_items: 100,
            count: 21,
          },
          count: 21,
          items: 6,
          outset: 0,
          page: 2,
          last: 2,
          pages: 2,
          offset: 15,
          from: 16,
          to: 21,
          prev: 1,
          next: null,
        },
      };
      cy.intercept(
        {
          method: "GET",
          url: "/api/v1/shop/products*",
        },
        testResponse
      ).as("get_products");

      cy.visit("/shop/shop");
    });

    it("render without likes", () => {
      cy.wait("@get_products").then(() => {
        cy.get(".like-container > .likes-count").should("not.exist");
      });
    });
  });

  context("Products list", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/v1/shop/products*").as("get_products");
      cy.visit("/shop/shop");
    });

    it("like a product", () => {
      cy.wait("@get_products").then(($interception) => {
        const productLikedID = Object.keys(
          $interception.response.body.data
        ).shift();
        const testProductLikes =
          $interception.response.body.data[productLikedID].likes_count;

        cy.get(".like-container > .icon").last().click();
        cy.get(".like-container > .likes-count")
          .last()
          .contains(testProductLikes + 1);
      });
    });
  });
});
