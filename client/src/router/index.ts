import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { RouteNames } from "@/utils/constants";
import { useUserStore } from "@/store/users";

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
      meta: {
        public: true,
      },
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();

  if (!userStore.user && userStore.doesTokenExist()) {
    try {
      await userStore.validateToken();
    } catch (error) {
      userStore.removeUser();
      next({
        name: RouteNames.SIGN_IN,
        query: to.matched.some((route) => route.name !== RouteNames.SIGN_IN)
          ? { redirect: encodeURI(to.fullPath) }
          : undefined,
      });
    }
  }

  if (to.matched.some((route) => !route.meta.public)) {
    if (userStore.user) {
      next();
    } else {
      next({
        name: RouteNames.SIGN_IN,
        query: { redirect: encodeURI(to.fullPath) },
      });
    }
  } else {
    if (userStore.user) {
      const redirect = to.query.redirect;
      if (redirect && typeof redirect === "string") {
        next({ path: decodeURI(redirect) });
      } else {
        next({ name: RouteNames.HOME });
      }
    } else {
      next();
    }
  }
});

export default router;
