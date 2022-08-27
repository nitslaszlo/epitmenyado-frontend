import { createApp } from "vue";
import App from "./App.vue";

import "vue-global-api/ref";
import "vue-global-api/toRef";
import "vue-global-api/toRefs";
import "vue-global-api/reactive";
import "vue-global-api/computed";
import "vue-global-api/watch";
import "vue-global-api/watchEffect";
import "vue-global-api/onMounted";
import "vue-global-api/onBeforeUpdate";
import "vue-global-api/onUpdated";
import "vue-global-api/onBeforeUnmount";
import "vue-global-api/onUnmounted";

const app = createApp(App);

// install all modules from `modules/*.ts`
const modules = import.meta.glob<any>("/src/modules/*.ts", { eager: true });
Object.values(modules).forEach((module) => module.install?.(app));

app.mount("#app");
