<script lang="ts">
  import { _ } from "svelte-i18n";
  import Button from "../button/Button.svelte";
  import LoadingSpinner from "../LoadingSpinner.svelte";
  import { marketing_schema as schema } from "$lib/validation_schemas";

  // Accept callback from parent component
  export let submitCallback: (email: string) => void;

  export let loading_submit: boolean = false;

  let email: string = "";
  let error_messages: string[] = [];

  const handleInput = {
    email: (event: Event) => {
      email = (event.target as HTMLInputElement).value;
    },
  };

  async function handleSubmit() {
    try {
      error_messages = [];
      loading_submit = true;

      await schema.validate({ email: email, n: undefined });
      submitCallback(email);
    } catch (e) {
      console.info(e.errors);
      error_messages = e.errors.map((error: string) => $_(error));
    } finally {
      loading_submit = false;
    }
  }
</script>

<form
  class="form"
  on:submit|preventDefault={handleSubmit}
  data-testid="marketing-form"
>
  <div class="input-container">
    {#each error_messages as error_message}
      <p class="error_message">
        {error_message}
      </p>
    {/each}

    <label for="email">{$_("components.marketing_form.email.label")}</label>
    <input
      type="text"
      id="email"
      data-testid="email-input"
      bind:value={email}
      placeholder={$_("components.marketing_form.email.placeholder")}
      on:input={handleInput.email}
    />
  </div>

  <div class="submit">
    {#if loading_submit}
      <div class="submit-loading">
        <LoadingSpinner size={30} />
      </div>
    {:else}
      <Button
        title={$_("components.marketing_form.contact")}
        variant="black"
        test_id="submit-button"
      />
    {/if}
  </div>
</form>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input-container label {
    font-weight: 600;
    display: var(--mobile-display);
  }

  .input-container input {
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

  .submit {
    margin: 0 auto;
  }

  .submit-loading {
    height: 42.5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (min-width: 1024px) {
    label {
      display: block;
    }
  }
</style>
