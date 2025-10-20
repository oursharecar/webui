<script setup>
import { watch, defineProps } from 'vue';
import { useAsyncState } from '@vueuse/core';

import { loadUser } from '../backend';

const props = defineProps({
  userId: {
    type: String,
    requied: true,
    default: "0"
  },
  link: {
    type: Boolean,
    default: false
  }
});

const {
  state: user, isLoading, executeImmediate
} = useAsyncState(loadUser(props.userId), props.userId, { immediate: true });

watch(
  () => props.userId, () => { executeImmediate(); },
);
</script>

<template>
  <div>
    <p v-if="isLoading">
      読み込み中...
    </p>

    <div v-if="link">
      <RouterLink :to="'/users/' + userId">
        {{ user ? user.nickname : userId }}
      </RouterLink>
    </div>

    <div v-if="!link">
      {{ user ? user.nickname : userId }}
    </div>
  </div>
</template>
