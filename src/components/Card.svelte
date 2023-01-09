<script lang="ts">
  import Like from "./like/Like.svelte";
  import {
    createProductLike,
    removeProductLike,
  } from "../services/like_service";
  import type { IProduct } from "src/api/products";
  import { user } from "../stores/user";
  import type { CompanySlug } from "src/api/company";

  export let company_id: CompanySlug;
  export let product: IProduct;
  export let show_media: boolean;

  let { id, name, description, price, images, likes_count } = product;
  let image_public_id: IProduct["images"][0]["public_id"] =
    images[0]?.public_id;
  let isLiked: boolean = $user.likes.includes(id);
  let captionVisible = false;

  $: {
    // Reassign variables when product changes
    ({ id, name, description, price, images, likes_count } = product);
    image_public_id = images[0]?.public_id;
  }

  $: {
    // Reassign variables when $user changes or id changes
    isLiked = $user.likes.includes(id);
  }

  function onTouchStart() {
    captionVisible = true;
  }

  function onTouchEnd() {
    captionVisible = false;
  }
</script>

{#if image_public_id && show_media}
  <div class="card">
    <a href={`/shop/${company_id}/product/${id}`}>
      <img
        on:touchstart={onTouchStart}
        on:touchend={onTouchEnd}
        class={`img ${captionVisible && "blur"}`}
        src={`https://res.cloudinary.com/dnaexfddx/image/upload/f_auto,q_auto,w_200,h_200,dpr_auto,c_fill/${image_public_id}`}
        alt={name}
      />
    </a>

    <div class={`caption ${captionVisible && "visible"}`}>
      <h3 class="title">{name}</h3>
      <div class="card-footer">
        <p class="price">$ {price}</p>
      </div>
    </div>
  </div>
{:else}
  <div class="card">
    <div class="no-image">
      <h3 class="title">{name}</h3>

      {#if description}
        <p class="description">{description}</p>
      {/if}
      <div class="card-footer">
        <Like
          createLikeCallback={() => {
            createProductLike(id);
          }}
          removeLikeCallback={() => {
            removeProductLike(id);
          }}
          {isLiked}
          {likes_count}
        />
        <p class="price">$ {price}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .card {
    position: relative;
    padding-left: 5px;
  }

  .no-image {
    margin-bottom: 5px;
    border-radius: 3px;
    padding: 20px;
  }

  .img {
    width: 100%;
    object-fit: cover;
    border-radius: 3px;
  }

  .img.blur {
    filter: blur(3px);
  }

  .caption {
    display: none;
    position: absolute;
    bottom: 8px;
    left: 25px;
    color: #fff;
  }

  .caption.visible {
    display: block;
  }
  .title {
    margin: 0;
    text-transform: capitalize;
    border-radius: 3px;
  }
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
