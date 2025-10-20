<script setup>
import { Auth0Client } from '@auth0/auth0-spa-js';

import { auth0Config } from '../config.js'

const client = new Auth0Client(auth0Config);

function loginWithRedirect() {
  client.loginWithRedirect();
}

function logout() {
  client.logout();
}
</script>

<template>
  <div>
    <button @click="loginWithRedirect()">
      Login
    </button>
    <button @click="logout()">
      Logout
    </button>
  </div>
</template>
