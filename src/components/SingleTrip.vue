<script setup>
import { computed } from 'vue'

import { formatJaDateTime } from '../utils/date.js';
import UserLabel from './UserLabel.vue';

const props = defineProps({
  date: {
    type: [Date, String],
    default: "0"
  },
  trip: {
    type: Number,
    default: 0,
  },
  users: {
    type: Array,
    default: () => []
  }
});

const dateString = computed(() => {
  try {
    const date = new Date(props.date)
    return formatJaDateTime(date)
  } catch (e) {
    return "Error formatting Date"
  }
})
</script>

<template>
  <div id="trip-container">
    {{ dateString }}
    走行距離: {{ trip }} km
    使用者:
    <ul id="users-list">
      <li
        v-for="userId in users"
        :key="userId"
      >
        <UserLabel
          :user-id
          :link="true"
        />
      </li>
    </ul>
  </div>
</template>
