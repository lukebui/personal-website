import { createRouter, createWebHistory } from "vue-router";
import { RouteNames } from "@/enums";
import { useUserStore } from "@/store/users";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: RouteNames.HOME,
      redirect: { name: RouteNames.CONTACTS },
    },
    {
      path: "/contacts",
      children: [
        {
          path: "",
          name: RouteNames.CONTACTS,
          component: () => import("@/views/ContactsView.vue"),
        },
        {
          path: "parent-types",
          name: RouteNames.CONTACTS_PARENT_TYPES,
          component: () => import("@/views/ParentTypesView.vue"),
        },
      ],
    },
    {
      path: "/references",
      name: RouteNames.REFERENCES,
      component: () => import("@/views/ReferencesView.vue"),
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
