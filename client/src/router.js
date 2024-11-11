import { createRouter, createWebHistory } from "vue-router";
import DataAnalysis from "./components/DataAnalysis.vue";
import RawData from "./components/RawData.vue";
import Home from "./components/Home.vue";

const routes = [
  { path: "/data-analysis", component: DataAnalysis },
  { path: "/raw-data", component: RawData },
  { path: "/", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
