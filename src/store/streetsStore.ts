import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify } from "quasar";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
  progress: true,
});

interface IFields {
  _id?: string; // PK
  adosav_id?: string | { sav: string; ado: number; hatar: number }; // FK
  adoszam?: number;
  utca?: string;
  hazszam?: string;
  terulet?: number;
}

interface IPagination {
  sortBy?: string;
  descending?: boolean;
  page?: number;
  rowsPerPage?: number;
  rowsNumber?: number;
  filter?: string;
}

interface IState {
  dataN: Array<IFields>; // store documents (records) after get method(s)
  dataNfiltered: Array<IFields>;
  data: IFields; // temporary object for create, edit and delete methods
  dataOld: IFields; // temporary object for patch method (store data here before edit)
  selected: Array<IFields>;
  isLoading: boolean;
  pagination: IPagination;
}

export const useStreetsStore = defineStore({
  id: "streetsStore",
  state: (): IState => ({
    dataN: [],
    dataNfiltered: [],
    data: {},
    dataOld: {},
    selected: [],
    isLoading: false,
    pagination: {
      sortBy: "utca",
      rowsPerPage: 10,
      filter: "",
    },
  }),
  getters: {},
  actions: {
    async getAll(): Promise<void> {
      this.isLoading = true;
      this.dataN = [];
      $axios
        .get("utcak")
        .then((res) => {
          if (res && res.data) {
            this.dataN = res.data;
          }
        })
        .catch((error) => {
          Notify.create({
            message: `Error (${error.response.data.status}) while get all: ${error.response.data.message}`,
            color: "negative",
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async getById(): Promise<void> {
      if (this.data && this.data._id) {
        this.isLoading = true;
        $axios
          .get(`utcak/${this.data._id}`)
          .then((res) => {
            if (res && res.data) {
              this.data = res.data;
              Object.assign(this.dataOld, this.data);
            }
          })
          .catch((error) => {
            Notify.create({
              message: `Error while get by id: ${error.message}`,
              color: "negative",
            });
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },

    async fetchPaginatedStreets(): Promise<void> {
      this.isLoading = true;
      $axios
        .get(`utcak/${(this.pagination.page as number) - 1}/${this.pagination.rowsPerPage}/${this.pagination.sortBy}/${this.pagination.filter}`)
        .then((res) => {
          if (res && res.data) {
            this.dataN = res.data.utcak;
            this.pagination.rowsNumber = res.data.count;
          }
        })
        .catch((error) => {
          Notify.create({
            message: `Error (${error.response.data.status}) while fetch paginated: ${error.response.data.message}`,
            color: "negative",
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async editById(): Promise<void> {
      if (this.data && this.data._id) {
        const diff: any = {};
        Object.keys(this.data).forEach((k, i) => {
          const newValue = Object.values(this.data)[i];
          const oldValue = Object.values(this.dataOld)[i];
          if (newValue != oldValue) diff[k] = newValue;
        });
        if (Object.keys(diff).length == 0) {
          Notify.create({
            message: "Nothing changed!",
            color: "negative",
          });
        } else {
          this.isLoading = true;
          $axios
            .patch(`utcak/${this.data._id}`, diff)
            .then((res) => {
              if (res && res.data) {
                this.dataOld = { ...this.data };
                Notify.create({
                  message: `Document with id=${res.data._id} has been edited successfully!`,
                  color: "positive",
                });
              }
            })
            .catch((error) => {
              Notify.create({
                message: `Error (${error.response.data.status}) while edit by id: ${error.response.data.message}`,
                color: "negative",
              });
            })
            .finally(() => {
              this.fetchPaginatedStreets();
            });
        }
      }
    },

    async deleteById(): Promise<void> {
      this.isLoading = true;
      while (this.selected.length) {
        const id_for_delete = this.selected.pop()?._id;
        await $axios
          .delete(`utcak/${id_for_delete}`)
          .then(() => {
            Notify.create({
              message: `Document with id=${id_for_delete} has been deleted successfully!`,
              color: "positive",
            });
          })
          .catch((error) => {
            Notify.create({
              message: `Error (${error.response.data.status}) while delete by id: ${error.response.data.message}`,
              color: "negative",
            });
          })
          .finally(() => {
            if (this.selected.length == 0) {
              this.fetchPaginatedStreets();
            }
          });
      }
    },

    async create(): Promise<void> {
      if (this.data) {
        this.isLoading = true;
        $axios
          .post("utcak", this.data)
          .then((res) => {
            if (res && res.data) {
              Notify.create({
                message: `New document with id=${res.data._id} has been saved successfully!`,
                color: "positive",
              });
            }
          })
          .catch((error) => {
            Notify.create({
              message: `Error (${error.response.data.status}) while create: ${error.response.data.message}`,
              color: "negative",
            });
          })
          .finally(() => {
            this.fetchPaginatedStreets();
          });
      }
    },
  },
});
