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
        signIn: true,
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
      return;
    }
  }

  if (to.matched.some((route) => !route.meta.public) && !userStore.user) {
    next({
      name: RouteNames.SIGN_IN,
      query: { redirect: encodeURI(to.fullPath) },
    });
    return;
  }

  if (to.matched.some((route) => route.meta.signIn) && userStore.user) {
    next(
      to.query.redirect && typeof to.query.redirect === "string"
        ? { path: decodeURI(to.query.redirect) }
        : { name: RouteNames.HOME }
    );

    return;
  }

  next();
});

export default router;
