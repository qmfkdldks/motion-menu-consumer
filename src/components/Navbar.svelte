<script lang="ts">
    import Logo from './Logo.svelte';
    import { _ } from 'svelte-i18n';

    export let handleButtonTrack: (button: string) => void = () => {}; // optional function

</script>

<header>
    <Logo />

    <div class="links">
        <a href="https://guide.motion.menu">{$_('how_to_use')}</a>
        <a href="https://admin.motion.menu/sign_up" on:click={() => handleButtonTrack('sign_up')}>{$_('sign_up')}</a>
        <a href="https://admin.motion.menu/sign_in">{$_('sign_in')}</a>
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1280px;
        margin: auto;
        margin-top: 15px;
        padding: 0 15px;
    }
    .links {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    a {
        margin-right: 13px;
    }
</style>
