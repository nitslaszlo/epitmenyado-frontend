import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AboutView from "./views/AboutView.vue";
import AccountView from "./views/AccountView.vue";
import QTableViewVue from "./views/QTableView.vue";
import StartPageView from "./views/StartPageView.vue";
import EditStreetView from "./views/EditStreetView.vue";
import NewStreetView from "./views/NewStreetView.vue";

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
  },
  {
    path: "/newStreet",
    name: "newStreet",
    component: NewStreetView,
  },
  {
    path: "/qtable",
    name: "qtable",
    component: QTableViewVue,
  },
  {
    path: "/about",
    name: "about",
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
