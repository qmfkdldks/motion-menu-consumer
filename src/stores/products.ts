import { derived, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { IProduct } from "src/api/products";

interface IProductDictionary {
  [key: string]: IProduct;
}

export interface IGroupedProducts {
  [key: string]: Array<IProduct["id"]>;
}

class ProductsStore {
  constructor(
    // public ids: Writable<Array<string>> = writable([]),
    public dic: Writable<IProductDictionary> = writable({}),
    public query: Writable<string> = writable("")
  ) {}

  get ids() {
    return derived(this.dic, ($dic) => {
      let list = Object.values($dic).map((product) => product.id);
      return list.filter((v, i) => list.indexOf(v) === i);
    });
  }

  get grouped_by_tags() {
    return derived([this.dic, this.ids], ([$dic, $ids]) => {
      return $ids.reduce(
        (result: IGroupedProducts, product_id: IProduct["id"]) => {
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
        },
        {}
      );
    });
  }

  get ids_with_videos() {
    return derived([this.dic, this.ids], ([$dic, $ids]) => {
      return $ids.filter((id) => $dic[id].videos_count > 0);
    });
  }

  get ids_with_images() {
    return derived([this.dic, this.ids], ([$dic, $ids]) => {
      return $ids.filter(
        (id) => $dic[id].images_count > 0 && $dic[id].videos_count < 1
      );
    });
  }

  get filtered_ids() {
    return derived([this.ids, this.dic, this.query], ([$ids, $dic, $query]) => {
      let term = $query.toLowerCase();
      return $ids.filter((id) => {
        return (
          $dic[id].name.toLowerCase().includes(term) ||
          $dic[id].tags.some((tag) => {
            return tag.name.toLowerCase().includes(term);
          })
        );
      });
    });
  }
}

export const productsStore = new ProductsStore();
