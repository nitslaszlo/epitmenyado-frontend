import { resolve } from "path";
import { defineConfig } from "vite";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: "src/assets/quasar-variables.sass" }),
    VueI18nPlugin({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: resolve(__dirname, "src/locales/**"),
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
      "~": resolve(__dirname, "src"),
    },
  },
  define: {
    "process.env": {},
  },
  build: {
    // reportCompressedSize: true,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/")) {
            // Set the NPM package
            const modules = ["quasar", "@quasar", "vue", "@vue"];
            const chunk = modules.find((module) => id.includes(`/node_modules/${module}`));
            return chunk ? `vendor-${chunk}` : "vendor";
          }
        },
      },
    },
  },
});
