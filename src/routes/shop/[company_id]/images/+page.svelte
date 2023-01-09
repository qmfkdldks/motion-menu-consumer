<script lang="ts">
  import { _ } from "svelte-i18n";
  import Logo from "../../../../components/Logo.svelte";
  import {
    dic as products_dic,
    ids_with_images,
    ids_with_videos,
  } from "../../../../stores/products.js";
  import { company } from "../../../../stores/company.js";
  import Masonry from "../../../../components/Masonry.svelte";
  import Card from "../../../../components/Card.svelte";
  import Video from "../../../../components/Video.svelte";

  // Fetch products data given shop company_id
  export let data;
  let company_id = data.company_id;
</script>

<svelte:head>
  {#if $company.name}
    <title>{$company.name} Motion Menu Photos</title>
  {:else}
    <title>Motion Menu</title>
  {/if}
  <meta
    name="description"
    content={`${$company.name} digital ${$_("menu")} - motion menu`}
  />
</svelte:head>

<main>
  <div class="header">
    <Logo />

    {#if $company.name}
      <div class="row">
        <h1>{$company.name}</h1>
      </div>

      <p>
        {#if $company.description}
          {$company.description}
        {/if}
      </p>
    {/if}

    <div class="row">
      <h5>{$_("featured_products")}</h5>
      <a href={`/shop/${company_id}`}><h5>{$_("menu")}</h5></a>
    </div>
  </div>

  {#if $ids_with_images.length + $ids_with_videos.length < 1}
    <div class="row no-image">
      <p>{$_("no_images")}</p>
      <a href={`/shop/${company_id}`}><h5>{$_("check_menu")}</h5></a>
    </div>
  {/if}

  <Masonry
    stretchFirst={false}
    gridGap={"10"}
    colWidth={"minmax(Min(50%, 225px), 1fr)"}
    items={[...$ids_with_videos, ...$ids_with_images]}
  >
    {#each $ids_with_videos as product_id}
      <Video
        id={$products_dic[product_id].id}
        name={$products_dic[product_id].name}
        price={$products_dic[product_id].price}
        video_public_id={$products_dic[product_id].videos[0]?.public_id}
      />
    {/each}

    {#each $ids_with_images as product_id}
      <Card {company_id} product={$products_dic[product_id]} show_media={true} />
    {/each}
  </Masonry>

  <div class="row center">
    <a href={`/shop/${company_id}`} class="button">{$_("more_products")}</a>
  </div>
</main>

<style>
  :global(body) {
    padding: 0px;
  }

  main {
    margin-top: 10px;
    padding-right: 5px;
  }

  h1 {
    text-transform: capitalize;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  }

  .header {
    padding: 30px 50px;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .center {
    justify-content: center;
  }

  .no-image {
    flex-direction: column;
  }

  .pagination {
    position: fixed;
    bottom: 20px;
    right: 30px;
    z-index: 99;
    font-size: 18px;
    border: none;
    outline: none;
    background-color: #f0efeb;
    color: #000000;
    cursor: pointer;
    padding: 15px;
    border-radius: 4px;
  }

  .button {
    background-color: rgba(51, 51, 51, 0.05);
    border-radius: 8px;
    border-width: 0;
    color: #333333;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin: 1rem 0 1rem 0;
    padding: 10px 12px;
    text-align: center;
    transition: all 200ms;
    white-space: nowrap;
    user-select: none;
    touch-action: manipulation;
    text-transform: capitalize;
  }
</style>
