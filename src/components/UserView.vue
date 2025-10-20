<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import HistoryView from './HistoryView.vue';
import { backendUrl, loadGroup, loadUser } from '../backend.js';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const group = ref(null);
const user = ref(null);
const isLoading = ref(true);
let activeRequest = 0; // guards against older fetches overwriting fresher state

const userName = computed(() => user.value?.nickname ?? props.userId);

async function fetchData() {
  const requestId = ++activeRequest;
  isLoading.value = true;
  try {
    const [groupData, userData] = await Promise.all([
      loadGroup(),
      loadUser(props.userId),
    ]);

    if (requestId === activeRequest) {
      group.value = groupData ?? null;
      user.value = userData ?? null;
    }
  } catch (error) {
    if (requestId === activeRequest) {
      console.error('Failed to load user view data', error);
      group.value = null;
      user.value = null;
    }
  } finally {
    if (requestId === activeRequest) {
      isLoading.value = false;
    }
  }
}

onMounted(fetchData);

watch(
  () => props.userId,
  () => {
    fetchData();
  },
);
</script>

<template>
  <div>
    <h1>{{ userName }}さんの走行履歴</h1>
    <div v-if="isLoading">
      読み込み中...
    </div>
    <div v-else-if="group">
      <HistoryView :uri="backendUrl(`/api/trips?user=${props.userId}&sort=end&order=-1&group=${group._id}`)" />
    </div>
    <div v-else>
      グループ情報を読み込めませんでした。
    </div>
  </div>
</template>
