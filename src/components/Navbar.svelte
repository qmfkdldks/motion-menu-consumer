<script lang="ts">
  import Logo from "./Logo.svelte";
  import { _ as t } from "svelte-i18n";
  import Button from "./button/Button.svelte";
  import { isAuthenticated, logout } from "../services/auth_service";
  import analytics from "../lib/analytics";
  import IoIosMenu from "svelte-icons/io/IoIosMenu.svelte";

  const BASE_URL = "https://admin.motion.menu";

  export let handleButtonTrack = (button_name: string) => {
    analytics.track(`components.navbar.${button_name}.click`);
  };
</script>

<header>
  <Logo />

  <div class="links">
    <div class="dropdown-icon">
      <IoIosMenu />
    </div>

    <div class="dropdown">
      <a href="/landing/qr-menu">
        <Button
          title={$t("components.navbar.QR_menu")}
          variant="borderless"
          onClick={() => {
            handleButtonTrack("qr-menu");
          }}
        />
      </a>
      <a href="/landing/restaurant-marketing">
        <Button
          title={$t("components.navbar.photos_and_videos")}
          variant="borderless"
          onClick={() => {
            handleButtonTrack("photos-and-videos");
          }}
        />
      </a>

      {#await isAuthenticated() then is_authenticated}
      {#if is_authenticated}
        <div class="dropdown-profile-button">
          <Button
            title={$t("components.navbar.greeting", {
              values: {
                name: "profile_name",
              },
            })}
            variant="borderless"
            active
          />
        </div>
        <!-- container has padding to don't lose hover when moving mouse to dropdown -->
        <div class="dropdown-profile-container">
          <div class="dropdown-profile">
            <a href="{BASE_URL}/products" rel="external">
              <Button
                title={$t("components.navbar.open_app")}
                variant="borderless"
                onClick={() => {
                  handleButtonTrack("open-app");
                }}
              />
            </a>
            <Button
              title={$t("components.navbar.sign_out")}
              variant="red"
              onClick={async () => {
                await logout();
                handleButtonTrack("sign-out");
              }}
            />
          </div>
        </div>
      {:else}
        <a href="https://admin.motion.menu">
          <Button
            title={$t("components.navbar.sign_in")}
            variant="borderless"
            onClick={() => {
              handleButtonTrack("sign-in");
            }}
          />
        </a>
        <a href="/landing/build-qr-menu-for-restaurants">
          <Button
            title={$t("components.navbar.try_qr")}
            variant="borderless"
            onClick={() => {
              handleButtonTrack("sign-up");
            }}
          />
        </a>
      {/if}
      {/await}
    </div>
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1024px;
    margin: auto;
    margin-top: 1em;
    padding: 0 1em;
  }

  .links {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }

  .dropdown-icon {
    width: 25px;
    color: var(--black);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dropdown {
    display: none;
    flex-direction: column;
    align-items: center;
    width: 150px;
    background-color: var(--white);
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 5px;
    padding: 1em;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  .links:hover > .dropdown {
    display: flex;
  }

  .dropdown-profile-container {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding-top: 10px;
    border-radius: 5px;
  }

  .dropdown-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    .dropdown-icon {
      display: none;
    }

    .dropdown {
      width: auto;
      display: flex;
      flex-direction: row;
      position: static;
      background-color: transparent;
      box-shadow: none;
      padding: 0;
      gap: 10px;
    }

    .dropdown-profile-container {
      display: none;
      width: 150px;
      position: absolute;
      top: 0;
      right: 0;
      padding-top: 50px;
    }

    .dropdown-profile {
      background-color: var(--white);
    }

    .dropdown-profile-button:hover + .dropdown-profile-container,
    .dropdown-profile-container:hover {
      display: flex;
    }
  }
</style>
