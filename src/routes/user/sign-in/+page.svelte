<script lang="ts">
  import { login, logout, isAuthenticated } from "../../../services/auth_service";

  function onLoginClicked() {
    login()
  }

  function onLogoutClicked() {
    logout();
  }
</script>

<main>
  {#await isAuthenticated() then isAuthenticated}
    {#if isAuthenticated}
      <h1>Sign Out</h1>
      <button on:click={onLogoutClicked}>Log Out</button>
    {:else}
      <h1>Sign In</h1>
      <button on:click={onLoginClicked}>Log In</button>
    {/if}
  {/await}
</main> 
