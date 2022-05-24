import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import hu from "../locales/hu.json";

export const install = (app: any) => {
  const i18nObject = createI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "en",
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    messages: {
      en,
      hu,
    },
    legacy: false,
    globalInjection: true,
  });
  app.use(i18nObject);
};
