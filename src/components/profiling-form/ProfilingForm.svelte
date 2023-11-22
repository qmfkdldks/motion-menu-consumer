<script lang="ts">
  import { _ } from "svelte-i18n";
  import Button from "../button/Button.svelte";
  import type { CompanyCategory } from "../../stores/company";
  import { profiling_schema as schema } from "../../lib/validation_schemas";

  export let handleSubmitCallback: (
    shop_name: string,
    category: CompanyCategory
  ) => void;

  const categories: CompanyCategory[] = [
    "empty",
    "pizza",
    "coffee",
    "hamburger",
    "saigon",
  ];
  let category_selected: CompanyCategory = "empty";
  let shop_name: string = "";

  let error_message: string = "";

  async function checkInput() {
    try {
      await schema.validate({ shop_name });
      error_message = "";
    } catch (error) {
      error_message = $_(error.errors[0]);
    }
  }

  function handleInput(event: Event) {
    shop_name = (event.target as HTMLInputElement).value;
  }

  function handleSubmit() {
    checkInput();

    if (error_message) {
      return;
    } else {
      handleSubmitCallback(shop_name, category_selected);
    }
  }
</script>

<form class="profiling_form" on:submit|preventDefault={handleSubmit}>
  <div class="shop_name_input">
    <label for="shop_name">{$_("routes.shop.profiling.input_label")}</label>
    <input
      type="text"
      id="shop_name"
      data-testid="shop-name-input"
      bind:value={shop_name}
      placeholder={$_("routes.shop.profiling.input_placeholder")}
      on:input={handleInput}
      on:blur={checkInput}
    />
    {#if error_message}
      <p class="error_message" data-testid="error-message">
        {error_message}
      </p>
    {/if}
  </div>
  <div class="profiling_categories">
    <div class="categories">
      {#each categories as category}
        <div
          class={`profiling_category ${
            category_selected === category ? "checked" : ""
          }`}
        >
          <input
            type="radio"
            name="category"
            data-testid="category-input"
            id={category}
            value={category}
            on:click={() => {
              category_selected = category;
            }}
            checked={category_selected === category}
          />
          <label for={category}>
            {$_(`routes.shop.profiling.categories.${category}`)}
          </label>
        </div>
      {/each}
    </div>
    <div class="categories_description">
      <p style="font-weight: 600;">
        {$_("components.profiling_form.categories_description_title")}
      </p>
      <p>{$_("components.profiling_form.categories_description")}</p>
    </div>
  </div>

  <div class="profiling_submit">
    <Button
      title={$_("routes.shop.profiling.button")}
      variant="black"
      test_id="submit-button"
    />
  </div>
</form>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  .profiling_form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .shop_name_input {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .shop_name_input label {
    font-weight: 600;
    display: var(--mobile-display);
  }

  .shop_name_input input {
    height: 50px;
    padding: 20px 15px;
    border-radius: 8px;
    color: rgb(51, 51, 51);
    background-color: rgb(235, 235, 235);
    border: none;
  }

  input:focus {
    outline: none;
    border: 1px solid var(--blue_highlighted);
  }

  .error_message {
    color: var(--red);
    font-weight: 600;
  }

  .profiling_categories {
    display: flex;
    gap: 20px;
  }

  .categories {
    display: flex;
    flex-direction: column;
    text-transform: capitalize;
    gap: 7px;
    padding-left: 10px;
  }

  .categories_description {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .profiling_category {
    display: flex;
    align-items: center;

    gap: 5px;
  }

  .profiling_category input {
    margin: 0;
    cursor: pointer;
  }

  .profiling_category label {
    cursor: pointer;
    font-size: 17px;
    letter-spacing: 0.5px;
  }

  .profiling_category.checked label {
    font-weight: 600;
  }

  .profiling_submit {
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    label {
      display: block;
    }
  }
</style>
