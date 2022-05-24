import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AboutView from "./views/AboutView.vue";
import AccountView from "./views/AccountView.vue";
import QTableViewVue from "./views/QTableView.vue";
import StartPageView from "./views/StartPageView.vue";
import EditStreetView from "./views/EditStreetView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "StartPage",
    component: StartPageView,
  },
  {
    path: "/account",
    name: "Account",
    component: AccountView,
  },
  {
    path: "/editStreet",
    name: "Edit street",
    component: EditStreetView,
  },
  {
    path: "/qtable",
    name: "q-table",
    component: QTableViewVue,
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});
export default router;
