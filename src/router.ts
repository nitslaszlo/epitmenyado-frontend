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
    path: "/qtablestreet",
    name: "qtablestreet",
    component: QTableStreetView,
  },
  {
    path: "/editTaxBand",
    name: "editTaxBand",
    component: EditTaxBandView,
  },
  {
    path: "/newTaxBand",
    name: "newTaxBand",
    component: NewTaxBandView,
  },
  {
    path: "/qtabletaxband",
    name: "qtabletaxband",
    component: QTableTaxBandView,
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
