import client from "./client";
import type { CompanySlug } from "./company";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  images: Array<{
    id: number;
    public_id: string;
  }>;
  videos: any[];
  images_count: number;
  videos_count: number;
  price: number;
  tags: Array<{
    id: number;
    name: string;
  }>;
  likes_count: number;
}

interface IResponse {
  data: { [key: string]: IProduct };
  meta: { [key: string]: any };
}

export const get_products = async (
  company_id: CompanySlug
): Promise<IResponse> => {
  const response = await client.get(
    `/api/v1/${company_id}/products?page=1&per_page=15`
  );

  return response.data;
};

export const get_products_by_page = async (
  company_id: CompanySlug,
  page: number
): Promise<IResponse> => {
  const response = await client.get(
    `/api/v1/${company_id}/products?page=${page}&per_page=15`
  );

  return response.data;
};
