<script lang="ts">
  import Logo from "../../../../../components/Logo.svelte";
  import { dic } from "../../../../../stores/products";

  export let data;
  let product = $dic[data.product_id];

  function goBack() {
    window.history.back();
  }
</script>

<div class="logo">
  <Logo />
</div>

<div class="container">
  {#if product}
    <div
      class={`image-container ${
        product.images_count + product.videos_count < 2 && "one-image"
      }`}
    >
      {#each product.videos as video}
        <video class="video" playsinline autoplay muted loop>
          <source
            src={`https://res.cloudinary.com/dnaexfddx/video/upload/w_250,h_250,dpr_2.0,c_fill/v1617422473/${video.public_id}.webm`}
            type="video/webm"
          />
          <source
            src={`https://res.cloudinary.com/dnaexfddx/video/upload/w_250,h_250,dpr_2.0,c_fill/v1617422473/${video.public_id}d.mp4`}
            type="video/mp4"
          />
          <source
            src={`https://res.cloudinary.com/dnaexfddx/video/upload/w_250,h_250,dpr_2.0,c_fill/v1617422473/${video.public_id}.ogg`}
            type="video/ogg"
          />
          Your browser does not support the video tag.
        </video>
      {/each}
      {#each product.images as image}
        <img
          class="img"
          src={`https://res.cloudinary.com/dnaexfddx/image/upload/f_auto,q_auto,w_250,h_250,dpr_2.0,c_fill,g_auto/${image.public_id}.jpg`}
          alt={product.name}
        />
      {/each}
    </div>

    <div class="description">
      <h1>{product.name}</h1>
      {#if product.description}
        <p>{product.description}</p>
      {/if}

      <p class="price">$ {product.price}</p>
    </div>
  {/if}

  <div class="footer">
    <button class="button" on:click={goBack}>Go back</button>
  </div>
</div>

<style>
  .container {
    margin-top: 23px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .logo {
    margin-left: 15px;
    margin-top: 15px;
  }

  .img {
    width: 90%;
    object-fit: cover;
    border-radius: 3px;
  }

  .video {
    width: 90%;
    object-fit: cover;
    border-radius: 3px;
  }

  .description {
    width: 100%;
    max-width: 300px;
    padding: 0px 15px;
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
  }

  .image-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow-x: auto;
    margin-left: 15px;
  }

  .one-image {
    margin: 0;
    justify-content: center;
  }

  .image-container > img,
  .image-container > video {
    margin-right: 10px;
  }

  .one-image > img,
  .one-image > video {
    margin-right: 0px;
  }

  .tag {
    border-radius: 3px;
    background-color: #ef476f;
    color: #fff;
    padding: 5px 10px;
    text-transform: capitalize;
    margin-right: 3px;
  }

  h1 {
    color: black;
    text-transform: capitalize;
  }

  .price {
    font-weight: bold;
    margin: 0;
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

  .footer {
    position: sticky;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
