import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import("../features/expenses/views/expense-manager/ExpenseManagerView.vue"),
    },
    {
    path: "/register",
      name: "register",
      component: () =>
        import("../features/auth/views/RegisterView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import("../features/auth/views/LoginView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
