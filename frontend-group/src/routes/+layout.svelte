<script>
  import Navbar from '../components/Navbar.svelte';
  import { page } from '$app/stores';
</script>

<div class="app-layout">
  <Navbar />
  <main class="main-content">
    <slot />
  </main>
</div>

<style>
  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    width: 100%;
  }
</style>
