import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import CvView from '../views/CvView.vue';
import PortfolioView from '../views/PortfolioView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/cv', name: 'cv', component: CvView },
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
