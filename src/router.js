import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/HomeView.vue'
import UserView from "./components/UserView.vue";
import FormView from './components/FormView.vue'
import CallbackHandler from './components/Auth0CallbackHandler.vue'
import TripsOverview from './components/TripsOverview.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/history', component: TripsOverview },
  { path: '/form', component: FormView },
  { path: '/users/:userId', component: UserView, props: true },
  { path: '/callback', component: CallbackHandler }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
