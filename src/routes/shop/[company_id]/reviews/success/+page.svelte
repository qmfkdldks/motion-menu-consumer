<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { CompanySlug } from "../../../../../stores/public/companies";
  import Button from "../../../../../components/button/Button.svelte";
  import HistoryBack from "../../../../../components/history-back/HistoryBack.svelte";
  import { goto } from "$app/navigation";
  import Navbar from "../../../../../components/Navbar.svelte";

  export let data;

  let company_id: CompanySlug = data.company_id;
</script>

<svelte:head>
  <title>Review submitted</title>
  <meta name="description" content="Thank you for your review" />
</svelte:head>

<Navbar />
<main>
  <section>
    <h1>
      <span class="text-blue">{$_("thank_you")}</span>
      {$_("success_title")}
    </h1>
    <div class="congrats-emoji">🥳</div>
    <Button
      onClick={() => {
        goto(`/shop/${company_id}/images`);
      }}
      title={$_("back_to_menu")}
      variant="primary"
    />
    <p>{$_("success_message")}</p>
  </section>
  <HistoryBack />
</main>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  section {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }

  h1 {
    font-weight: 600;
    line-height: 1.2;
    font-size: 40px;
  }

  h1 .text-blue {
    color: var(--blue_highlighted);
  }

  .congrats-emoji {
    font-size: 50px;
  }

  @media (min-width: 768px) {
    section {
      width: 50%;
    }

    h1 {
      font-size: 50px;
      text-align: center;
    }

    .congrats-emoji {
      font-size: 60px;
    }
  }
</style>
