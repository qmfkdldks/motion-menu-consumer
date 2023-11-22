<script lang="ts">
  import { _ } from "svelte-i18n";
  import { toast } from "svelte-french-toast";
  import { goto } from "$app/navigation";
  import { company, type ICompany } from "../../stores/company";
  import { createReview } from "../../api/reviews";
  import { is_authenticated, user } from "../../stores/user_store";
  import Button from "../../components/button/Button.svelte";
  import LoadingSpinner from "../../components/LoadingSpinner.svelte";
  import { review_schema as schema } from "../../lib/validation_schemas";

  type ReviewPage = "index" | "form";

  // props
  export let trackSubmitForm: (aditional_props: {
    authenticated: boolean;
  }) => void;

  export let page: ReviewPage = "index";
  export let height: { default: number; desktop?: number } = {
    default: 200,
  };
  export let loading: boolean = false;

  let company_id: ICompany["id"] = $company.id;
  let comment: string = "";
  let error_occurred: boolean = false;

  // Create validation schema

  const handleInput = () => (event: Event) => {
    comment = (event.target as HTMLInputElement).value;
  };

  const handleSubmit = async () => {
    const sendReview = async () => {
      const response = await createReview(comment, company_id);
      if (response) {
        toast.success($_("review_post_success_message"));
        goto(`/shop/${company_id}/reviews/success`);
      } else {
        toast.error($_("review_post_error_message"));
      }
    };

    try {
      await schema.validate({ comment });
      if ($is_authenticated) {
        await sendReview();
        trackSubmitForm({ authenticated: true });
      } else {
        await $user.loginWithPopup();
        await sendReview();
        trackSubmitForm({ authenticated: false });
      }
    } catch (error) {
      error_occurred = true;
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label
    for="comment"
    style={page === "form"
      ? "--mobile-display: block" //if page is "form" always show label, otherwise only show on desktop
      : "--mobile-display: none"}>{$_("share_your_thought")}</label
  >
  <textarea
    id="comment"
    name="comment"
    rows="4"
    cols="50"
    placeholder={$_("type_something")}
    on:input={handleInput()}
    value={comment}
    style={`height: ${height.default}px; --desktop-height: ${height.desktop}px`}
  />
  {#if error_occurred}
    <p class="error_message" data-testid="error-message">
      {$_("comment_error_message")}
    </p>
  {/if}
  <div class="submit">
    {#if loading}
      <div class="submit-loading">
        <LoadingSpinner size={30} />
      </div>
    {:else}
      <p
        class="unauthenticated_message"
        data-testid="unauthenticated-message"
        style={page === "form"
          ? "--mobile-visibility: visible" //if page is "form" always show message, otherwise only show on desktop
          : "--mobile-visibility: hidden"}
      >
        {#if !$is_authenticated}
          {$_("sign-up_to_share_review")}
        {/if}
      </p>
      <div class="submit-button">
        <Button
          onClick={() => {}}
          title={$_(
            $is_authenticated
              ? "components.review_form.add_review"
              : "components.review_form.sign_up_to_share"
          )}
          variant="blue"
          test_id="submit-button"
        />
      </div>
    {/if}
  </div>
</form>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  label {
    font-weight: 600;
    display: var(--mobile-display);
  }

  textarea {
    min-width: 100%;
    max-width: 100%;
    min-height: 100px;
    max-height: 400px;
    padding: 20px 15px;
    border-radius: 8px;
    color: rgb(51, 51, 51);
    background-color: rgb(235, 235, 235);
    border: none;
  }

  .submit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .submit .submit-loading {
    margin-left: auto;
    width: 120px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  textarea:focus {
    outline: none;
    border: 1px solid var(--blue_highlighted);
  }

  .unauthenticated_message {
    visibility: var(--mobile-visibility);
  }

  .error_message {
    color: var(--red);
    font-weight: 600;
  }

  @media (min-width: 1024px) {
    label {
      display: block;
    }

    .unauthenticated_message {
      visibility: visible;
    }

    textarea {
      height: var(--desktop-height) !important;
    }
  }
</style>
