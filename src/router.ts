import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AboutView from "./views/AboutView.vue";
import AccountView from "./views/AccountView.vue";
import QTableStreetView from "./views/QTableStreetView.vue";
import QTableTaxBandView from "./views/QTableTaxBandView.vue";
import StartPageView from "./views/StartPageView.vue";
import EditStreetView from "./views/EditStreetView.vue";
import NewStreetView from "./views/NewStreetView.vue";
import EditTaxBandView from "./views/EditTaxBandView.vue";
import NewTaxBandView from "./views/NewTaxBandView.vue";
import { useUsersStore } from "./store/usersStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "startPage",
    component: StartPageView,
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
  },
  {
    path: "/editStreet",
    name: "editStreet",
    component: EditStreetView,
    meta: {
      needsAuth: true,
    },
  },
  {
    path: "/newStreet",
    name: "newStreet",
    component: NewStreetView,
    meta: {
      needsAuth: true,
    },
  },
  {
    path: "/qtablestreet",
    name: "qtablestreet",
    component: QTableStreetView,
    meta: {
      needsAuth: true,
    },
  },
  {
    path: "/editTaxBand",
    name: "editTaxBand",
    component: EditTaxBandView,
    meta: {
      needsAuth: true,
    },
  },
  {
    path: "/newTaxBand",
    name: "newTaxBand",
    component: NewTaxBandView,
    meta: {
      needsAuth: true,
    },
  },
  {
    path: "/qtabletaxband",
    name: "qtabletaxband",
    component: QTableTaxBandView,
    meta: {
      needsAuth: true,
    },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: {
      needsAuth: true,
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.needsAuth) {
    const usersStore = useUsersStore();
    if (usersStore.getLoggedUser) {
      next();
    } else {
      next("/account");
    }
  } else {
    next();
  }
});
export default router;
