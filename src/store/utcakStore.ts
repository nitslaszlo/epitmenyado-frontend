import $axios from "./axios.instance";
import { defineStore } from "pinia";
import { Notify, Loading } from "quasar";
import router from "src/router";

Notify.setDefaults({
  position: "bottom",
  textColor: "white",
  timeout: 3000,
  actions: [{ icon: "close", color: "white" }],
  progress: true,
});

interface IPaginatedParams {
  offset: number;
  limit: string;
  order: string;
  sort: string;
  keyword?: string;
}

interface IFields {
  _id?: number; // PK
  adosav?: number | { sav: string; ado: number; hatar: number }; // FK
  adoszam?: string;
  utca?: string;
  hazszam?: string;
  terulet?: number;
}

interface IState {
  numberOfStreets: number;
  dataN: Array<IFields>; // store documents (records) after get method(s)
  data: IFields; // temporary object for create, edit and delete method
  dataOld: IFields; // temporary object for patch method (store data here before edit)
  selected: Array<IFields>;
  isLoading: boolean;
}

function ShowErrorWithNotify(error: any): void {
  Loading.hide();
  let msg = `Error on N-side: ${error.response.status} ${error.response.statusText}`;
  if (error.response.data) {
    msg += ` - ${error.response.data}`;
  }
  Notify.create({ message: msg, color: "negative" });
}

export const useUtcakStore = defineStore({
  id: "utcakStore",
  state: (): IState => ({
    numberOfStreets: 0,
    dataN: [],
    data: {},
    dataOld: {},
    selected: [],
    isLoading: false,
  }),
  getters: {},
  actions: {
    async getAll(): Promise<void> {
      Loading.show();
      this.dataN = [];
      $axios
        .get("api/utcak")
        .then((res) => {
          Loading.hide();
          if (res && res.data) {
            this.dataN = res.data;
          }
        })
        .catch((error) => {
          ShowErrorWithNotify(error);
        });
    },
    async getById(): Promise<void> {
      if (this.data && this.data._id) {
        Loading.show();
        $axios
          .get(`api/utcak/${this.data._id}`)
          .then((res) => {
            Loading.hide();
            if (res && res.data) {
              this.data = res.data;
              Object.assign(this.dataOld, this.data);
            }
          })
          .catch((error) => {
            ShowErrorWithNotify(error);
          });
      }
    },
    async fetchPaginatedStreets(params: IPaginatedParams): Promise<void> {
      Loading.show();
      $axios
        .get(
          `api/utcak/${params.offset}/${params.limit}/${params.order}/${params.sort}/${params.keyword}`
        )
        .then((res) => {
          if (res && res.data) {
            this.dataN = res.data.utcak;
            this.numberOfStreets = res.data.count;
          }
          Loading.hide();
        })
        .catch((error) => {
          console.error("hiba: " + error);
          Loading.hide();
          Notify.create({
            message: `Error in paginated fetch posts: ${error.message}`,
            color: "negative",
          });
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
          this.isLoading = false;
          process.exit(0);
        }
        Loading.show();
        this.isLoading = true;
        $axios
          .patch(`api/utcak/${this.data._id}`, diff)
          .then((res) => {
            Loading.hide();
            if (res && res.data) {
              this.isLoading = false;
              this.selected = [];
              Notify.create({
                message: `Document with id=${res.data._id} has been edited successfully!`,
                color: "positive",
              });
              router.push("/qtable");
            }
          })
          .catch((error) => {
            ShowErrorWithNotify(error.message);
          });
      }
    },
    async deleteById(): Promise<void> {
      Loading.show();
      this.isLoading = true;
      if (this.selected.length) {
        const id_for_delete = this.selected.pop()?._id;
        await $axios
          .delete(`api/utcak/${id_for_delete}`)
          .then(() => {
            Loading.hide();
            Notify.create({
              message: `Document with id=${id_for_delete} has been deleted successfully!`,
              color: "positive",
            });
            if (this.selected.length) this.deleteById();
            else this.isLoading = false;
          })
          .catch((error) => {
            ShowErrorWithNotify(error);
          });
      }
    },
    async create(): Promise<void> {
      if (this.data) {
        Loading.show();
        // delete this.data.category;
        $axios
          .post("api/utcak", this.data)
          .then((res) => {
            Loading.hide();
            if (res && res.data) {
              // this.data = {};
              this.getAll();
              Notify.create({
                message: `New document with id=${res.data.id} has been saved successfully!`,
                color: "positive",
              });
              // router.push({ name: "page_name" });
            }
          })
          .catch((error) => {
            ShowErrorWithNotify(error);
          });
      }
    },
  },
});
