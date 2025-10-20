<script setup>
import Auth0Login from './components/Auth0Login.vue'
import { store } from './store';

store.loadUsers();
</script>

<template>
  <nav>
    <RouterLink to="/">
      Go to Home
    </RouterLink>
    <Auth0Login />
  </nav>
  <main>
    <Suspense>
      <RouterView />
    </Suspense>
  </main>
</template>
