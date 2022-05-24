import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { useUsersStore } from "../store/usersStore";

export default (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const usersStore = useUsersStore();
  if (usersStore.getLoggedUser) {
    next();
  } else {
    next("/account");
  }
};
