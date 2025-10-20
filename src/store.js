import { reactive } from 'vue';
import { loadUsers as fetchUsers } from './backend.js';

// global store to share app-wide dependencies
export const store = reactive({
  users: [],
  async loadUsers() {
    try {
      this.users = await fetchUsers();
    } catch (error) {
      console.error('Failed to load users', error);
      this.users = [];
    }
  },
});
