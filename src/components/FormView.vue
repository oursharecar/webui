<script setup>
import { ref } from 'vue';
import { loadGroup, createHistoryEntry } from '../backend.js';
import UserLabel from './UserLabel.vue'

const selectedUsers = ref([]);
const start = ref();
const end = ref();
const error = ref("");

const group = await loadGroup();

async function saveHistory() {
  try {
    validateForm();
    await createHistoryEntry(bundle());
    error.value = '';
  } catch (e) {
    if (e.name === 'HTTPError') {
      console.log(e.response);
      error.value = e.response.statusText;
    }
    else {
      console.log(e);
      error.value = e?.message ?? e;
    }
  }
}

function validateForm() {
  if (!(start.value && end.value)) {
    throw Error('入力値を確認してください。');
  }
  if (end.value < start.value) {
    throw Error('開始時<終了時である必要があります。')
  }
  if (selectedUsers.value.length <= 0) {
    throw Error('使用者を選択してください。')
  }
}

function bundle() {
  console.log(group._id)
  return {
    group: group._id,
    trip: end.value - start.value,
    users: selectedUsers.value
  }
}
</script>

<template>
  <h1>走行距離入力</h1>
  <div class="form-group">
    <label for="startOdometer">走行開始時オドメーター (km):</label>
    <input
      id="startOdometer"
      v-model="start"
      required
      type="number"
      placeholder="0"
    >
  </div>

  <div class="form-group">
    <label for="endOdometer">走行終了時オドメーター (km):</label>
    <input
      id="endOdometer"
      v-model="end"
      required
      type="number"
      placeholder="0"
    >
  </div>

  <div class="form-group">
    <label>使用した人 (複数選択可):</label>
    <div class="checkbox-group">
      <div
        v-for="(u, i) in group.members"
        :key="u._id"
        class="checkbox-item"
      >
        <input
          :id="'user' + i"
          v-model="selectedUsers"
          type="checkbox"
          name="user"
          :value="u"
        >
        <label>
          <UserLabel :user-id="u" />
        </label>
      </div>
    </div>
  </div>

  <button @click="saveHistory">
    記録を保存
  </button>
  <p
    id="message"
    style="color: red"
  >
    {{ error }}
  </p>
</template>
