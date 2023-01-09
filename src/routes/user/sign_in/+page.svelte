<script lang="ts">
  import { onMount } from "svelte";
  import auth from "../../../services/auth_service";
  import type { Auth0Client } from "@auth0/auth0-spa-js";

  let auth0Client: Auth0Client;

  onMount(async () => {
    auth0Client = await auth.createClient();
  });

  function onLoginClicked() {
    auth.loginWithPopup(auth0Client);
  }
</script>

<main>
  <a href="/" role="button" on:click={onLoginClicked}>Log In</a>
</main>
