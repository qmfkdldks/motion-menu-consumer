<script lang="ts">
  import { _ } from "svelte-i18n";
  import Button from "../button/Button.svelte";
  import LoadingSpinner from "../LoadingSpinner.svelte";
  import { sign_up_schema as schema } from "../../lib/validation_schemas";

  export let handleSubmitCallback: (
    email: string,
    password: string,
    password_confirmation: string
  ) => void;

  export let loading_submit: boolean = false;

  let email: string = "";
  let password: string = "";
  let password_confirmation: string = "";

  let error_message: {
    email: string;
    password: string;
    password_confirmation: string;
  } = {
    email: "",
    password: "",
    password_confirmation: "",
  };

  let checkInput = {
    email: async () => {
      try {
        await schema.validate({ email });
        error_message.email = "";
      } catch (error) {
        error_message.email = $_(error.errors[0]);
      }
    },
    password: async () => {
      try {
        await schema.validate({ password });
        error_message.password = "";
      } catch (error) {
        error_message.password = $_(error.errors[0]);
      }
    },
    password_confirmation: async () => {
      try {
        await schema.validateAt("password_confirmation", {
          password, // need to pass password to validate
          password_confirmation,
        });
        error_message.password_confirmation = "";
      } catch (error) {
        console.log(error.errors);

        error_message.password_confirmation = $_(error.errors[0]);
      }
    },
  };

  async function checkAllInputs() {
    await Promise.all([
      checkInput.email(),
      checkInput.password(),
      checkInput.password_confirmation(),
    ]);
  }

  const handleInput = {
    email: (event: Event) => {
      email = (event.target as HTMLInputElement).value;
    },
    password: (event: Event) => {
      password = (event.target as HTMLInputElement).value;
    },
    password_confirmation: (event: Event) => {
      password_confirmation = (event.target as HTMLInputElement).value;
    },
  };

  async function handleSubmit() {
    await checkAllInputs();

    if (Object.values(error_message).every((error) => error === "")) {
      handleSubmitCallback(email, password, password_confirmation);
    }
  }
</script>

<form
  class="sign-up_form"
  on:submit|preventDefault={handleSubmit}
  data-testid="sign-up-form"
>
  <div class="input">
    <label for="email">{$_("components.sign-up_form.email_input_label")}</label>
    <input
      type="text"
      id="email"
      data-testid="email-input"
      bind:value={email}
      placeholder={$_("components.sign-up_form.email_input_placeholder")}
      on:input={handleInput.email}
      on:blur={checkInput.email}
    />
    {#if error_message.email}
      <p class="error_message" data-testid="email-error-message">
        {error_message.email}
      </p>
    {/if}
  </div>

  <div class="input">
    <label for="password"
      >{$_("components.sign-up_form.password_input_label")}</label
    >
    <input
      type="password"
      id="password"
      data-testid="password-input"
      bind:value={password}
      placeholder={$_("components.sign-up_form.password_input_placeholder")}
      on:input={handleInput.password}
      on:blur={checkInput.password}
    />
    {#if error_message.password}
      <p class="error_message" data-testid="password-error-message">
        {error_message.password}
      </p>
    {/if}
  </div>

  <div class="input">
    <label for="password_confirmation"
      >{$_("components.sign-up_form.password_confirmation_input_label")}</label
    >
    <input
      type="password"
      id="password_confirmation"
      data-testid="password-confirmation-input"
      bind:value={password_confirmation}
      placeholder={$_(
        "components.sign-up_form.password_confirmation_input_placeholder"
      )}
      on:input={handleInput.password_confirmation}
      on:blur={checkInput.password_confirmation}
    />
    {#if error_message.password_confirmation}
      <p
        class="error_message"
        data-testid="password-confirmation-error-message"
      >
        {error_message.password_confirmation}
      </p>
    {/if}
  </div>

  <div class="sign-up_submit">
    {#if loading_submit}
      <div class="submit-loading">
        <LoadingSpinner size={30} />
      </div>
    {:else}
      <Button
        title={$_("components.sign-up_form.button")}
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

  .sign-up_form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input label {
    font-weight: 600;
    display: var(--mobile-display);
  }

  .input input {
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

  .sign-up_submit {
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
