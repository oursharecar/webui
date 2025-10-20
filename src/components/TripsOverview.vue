<script setup>

import { ref } from 'vue'
import HistoryView from './HistoryView.vue'
import { backendUrl, loadGroup } from '../backend';

const group = await loadGroup();
const uri = ref(backendUrl(`/api/trips?sort=end&order=-1&group=${group?._id}`))

</script>
<template>
  <HistoryView :uri="uri" />
</template>
