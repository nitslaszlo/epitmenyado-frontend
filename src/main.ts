import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// install all modules from `modules/*.ts`
const modules = import.meta.glob<any>("/src/modules/*.ts", { eager: true });
Object.values(modules).forEach((module) => module.install?.(app));

app.mount("#app");
