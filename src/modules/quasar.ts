// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/mdi-v6/mdi-v6.css";
// Import Quasar css
import "quasar/src/css/index.sass";

import { Quasar, Notify, Dialog, LocalStorage } from "quasar";

const config = {
  plugins: { Notify, Dialog, LocalStorage }, // import Quasar plugins and add here
  /*
  config: {
    brand: {
      // primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }
  */
  build: {
    devtool: "source-map",
  },
};

export const install = (app: any) => {
  app.use(Quasar, config);
};
