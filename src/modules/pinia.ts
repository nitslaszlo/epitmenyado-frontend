import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

export const install = (app: any) => {
  const pinia = createPinia();
  pinia.use(piniaPersist);
  app.use(pinia);
};
