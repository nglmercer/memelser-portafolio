import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import PortfolioView from '../views/PortfolioView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'portfolio', component: PortfolioView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.query.view || to.query.post) return { top: 0 };
    return undefined;
  },
});
