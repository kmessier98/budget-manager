import { useAuthStore } from "@/features/auth/stores/auth.ts";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home", //REMPLACER par dashboard..
      component: () =>
        import("../features/expenses/views/expense-manager/ExpenseManagerView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../features/auth/views/RegisterView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../features/auth/views/LoginView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

let isFirstLoad = true;

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // On appelle checkAuth UNIQUEMENT au chargement initial (F5 / premier accès)
  if (isFirstLoad) {
    await authStore.checkAuth();
    isFirstLoad = false;
  }

  // CAS A : La page demande d'être connecté, mais l'utilisateur est anonyme
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login"); // Bloqué -> Redirection au login
  }
  // CAS B : L'utilisateur EST connecté, mais tente d'aller sur la page /login
  else if (to.path === "/login" && authStore.isAuthenticated) {
    next("/"); // Bloqué -> Redirection vers l'espace sécurisé
  }
  // CAS C : Tout est correct (page publique, ou page privée avec session valide)
  else {
    next(); // Autoriser la navigation
  }
});

export default router;
