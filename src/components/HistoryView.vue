<script setup>
import { watch, defineProps } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { loadHistory as fetchHistoryEntries } from '../backend.js';
import SingleTrip from './SingleTrip.vue';

const props = defineProps({
  uri: {
    type: [String, URL],
    required: true,
  },
});

const {
  state: history, isLoading, executeImmediate
} = useAsyncState(fetchHistoryEntries(props.uri), [], { immediate: true });

watch(
  () => props.uri, () => { executeImmediate(); },
);

</script>

<template>
  <p v-if="isLoading">
    読み込み中...
  </p>
  <ul id="history-list">
    <li
      v-for="h in history"
      :key="h._id"
    >
      <SingleTrip v-bind="h" />
    </li>
  </ul>
</template>
