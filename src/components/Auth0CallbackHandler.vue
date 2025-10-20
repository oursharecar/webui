<script setup>
import { onMounted, ref } from 'vue';
import { Auth0Client } from '@auth0/auth0-spa-js';

import { router } from '../router.js'
import { auth0Config } from '../config.js'

const error = ref();

function handleCallback() {
  const auth0 = new Auth0Client(auth0Config);
  auth0.handleRedirectCallback().then(() => {
    console.log('Login flow completed. Redirecting to /.')
    router.replace('/')
  });
}

onMounted(() => {
  handleCallback();
})
</script>

<template>
  <div v-if="error">
    <h1>Something went wrong.</h1>
    <p>{{ error.message }}</p>
    <h2>Details:</h2>
    <p>{{ error.error_description }}</p>
  </div>
</template>
