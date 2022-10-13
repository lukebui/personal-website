import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { RouteNames } from "../../utils/constants";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: RouteNames.HOME,
      component: HomeView,
    },
    {
      path: "/sign-in",
      name: RouteNames.SIGN_IN,
      component: () => import("@/views/SignInView.vue"),
    },
  ],
});

export default router;
