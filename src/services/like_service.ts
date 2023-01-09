// LikeService

// Store update
// API communication
// Tracking logic

import { dic as products_dic } from "../stores/products";
import {
  get_product_likes,
  create_product_like,
  remove_product_like,
  type ILike,
} from "../api/likes";
import mixpanel from "mixpanel-browser";
import type { CompanySlug } from "src/api/company";
import type { IUser } from "src/stores/user";
import type { IProduct } from "src/api/products";
import { user } from "../stores/user";

let user_distinct_id: IUser["distinct_id"];

user.subscribe((user) => {
  user_distinct_id = user?.distinct_id;
});

export const getProductLikes = async (company_id: CompanySlug) => {
  try {
    const response = await get_product_likes(company_id, user_distinct_id);
    let user_likes: IUser["likes"] = Object.values(response.data).map(
      (like: ILike) => like.product_id
    );
    user.update((prev) => ({ ...prev, likes: user_likes }));
  } catch (err) {
    console.error(err);
  }
};

export const createProductLike = async (product_id: IProduct["id"]) => {
  try {
    const response = await create_product_like(product_id, user_distinct_id);
    products_dic.update((prev) => ({
      ...prev,
      [product_id]: response.data,
    }));
    if (response.data.id === product_id) {
      user.update((prev) => ({ ...prev, likes: [...prev.likes, product_id] }));
      mixpanel.track("product.like", { product_id: product_id });
    }
  } catch (err) {
    console.error(err);
  }
};

export const removeProductLike = async (product_id: IProduct["id"]) => {
  try {
    const response = await remove_product_like(product_id, user_distinct_id);
    products_dic.update((prev) => ({
      ...prev,
      [product_id]: response.data,
    }));
    if (response.data.id === product_id) {
      user.update((prev) => ({
        ...prev,
        likes: prev.likes.filter((id) => id !== product_id),
      }));
    }
  } catch (err) {
    console.error(err);
  }
};
