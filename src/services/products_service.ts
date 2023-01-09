import { browser } from "$app/environment";
import type { CompanySlug } from "src/api/company";
import { getProducts, getProduct } from "../api/products";
import { dic } from "../stores/products";

export async function loadProductsByPage(
  company_id: CompanySlug,
  page: number
) {
  const response = await getProducts(company_id, page);

  dic.update((prev) => ({
    ...prev,
    ...response.data,
  }));

  return response;
}

export async function loadAllProducts(company_id: CompanySlug) {
  // This is called for the initial server side page rendering and meta data.
  const response = await loadProductsByPage(company_id, 1);

  // It checks if it's client side and fetch all products to update products store.
  for (let page = 1; page <= (browser ? response.meta.pages : 2); page++) {
    await loadProductsByPage(company_id, page);
  }
}

export async function loadProduct(product_id: string) {
  const response = await getProduct(product_id);

  dic.update((prev) => ({
    ...prev,
    [response.data.id]: response.data,
  }));
}
