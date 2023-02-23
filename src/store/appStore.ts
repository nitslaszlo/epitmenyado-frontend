import { defineStore } from "pinia";

interface IState {
  showDialog: boolean;
  isEditDocument: boolean;
}

export const useAppStore = defineStore({
  id: "appStore",
  state: (): IState => ({
    showDialog: false,
    isEditDocument: false,
  }),
  persist: {
    enabled: true,
  },
});
