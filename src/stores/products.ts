import { derived, writable } from "svelte/store";
import type { Writable } from "svelte/store";

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

interface IProductDictionary {
  [key: string]: IProduct;
}

export interface IGroupedProducts {
  [key: string]: Array<IProduct["id"]>;
}

export const dic: Writable<IProductDictionary> = writable({});
export const query: Writable<string> = writable("");

export const ids = derived(dic, ($dic) => {
  let list = Object.values($dic).map((product) => product.id);
  return list.filter((v, i) => list.indexOf(v) === i);
});

export const grouped_by_tags = derived([dic, ids], ([$dic, $ids]) => {
  return $ids.reduce((result: IGroupedProducts, product_id: IProduct["id"]) => {
    // Identify which tag the product belongs to
    let tag: IProduct["tags"][0]["name"] =
      $dic[product_id].tags.length > 0
        ? $dic[product_id].tags[0].name.toLowerCase().trim()
        : "No tag";

    // Assign array of product ids given tag and sort by name
    result[tag] = [...(result[tag] || []), product_id].sort((a, b) =>
      $dic[a].name.localeCompare($dic[b].name)
    );

    return result;
  }, {});
});

export const ids_with_media = derived([dic, ids], ([$dic, $ids]) => {
  return $ids.filter(
    (id) => $dic[id].images_count > 0 || $dic[id].videos_count > 0
  );
});

export const filtered_ids = derived(
  [ids, dic, query],
  ([$ids, $dic, $query]) => {
    let term = $query.toLowerCase();
    return $ids.filter((id) => {
      return (
        $dic[id].name.toLowerCase().includes(term) ||
        $dic[id].tags.some((tag) => {
          return tag.name.toLowerCase().includes(term);
        })
      );
    });
  }
);
