import { getCompany } from "../../../../services/profile_service";
import { loadAllProducts } from "../../../../services/products_service";
import { getProductLikes } from "../../../../services/like_service";

interface IRouteParams {
  params: {
    company_id: string;
  };
}

export async function load({ params }: IRouteParams) {
  let company_id = params.company_id;

  await getCompany(company_id);
  await loadAllProducts(company_id);
  await getProductLikes(company_id);

  return {
    company_id: params.company_id,
  };
}
