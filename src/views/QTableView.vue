<script setup lang="ts">
  import { useUtcakStore } from "../store/utcakStore";
  import { storeToRefs } from "pinia";
  import router from "src/router";

  const utcakStore = useUtcakStore();

  const { isLoading, dataN } = storeToRefs(utcakStore);

  watch(isLoading, () => {
    onRequest({
      pagination: pagination,
    });
  });

  watch(dataN, () => {
    pagination.value.rowsNumber = utcakStore.numberOfStreets;
  });

  function deleteRecord(): void {
    utcakStore.deleteById();
  }

  function newRecord(): void {
    // pass
  }

  function editRecord(): void {
    utcakStore.dataOld = { ...utcakStore.selected[0] };
    utcakStore.data = { ...utcakStore.selected[0] };
    router.push("/editStreet");
  }

  const columns: any[] = [
    { name: "id", label: "_id", field: "_id", align: "left", sortable: true },
    { name: "adoszam", label: "Adószám", field: "adoszam", align: "left", sortable: true },
    {
      name: "adosav",
      label: "Sáv",
      field: (row: any) => row.adosav.sav,
      align: "center",
    },
    {
      name: "ado",
      label: "Adó",
      field: (row: any) => row.adosav.ado,
      align: "center",
    },
    { name: "utca", label: "Utca", field: "utca", align: "left", sortable: true },
    { name: "hazszam", label: "Házszám", field: "hazszam", align: "left", sortable: true },
    { name: "terulet", label: "Terület", field: "terulet", align: "left", sortable: true },
  ];

  const pagination = ref({
    sortBy: "utca",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: utcakStore.numberOfStreets,
    filter: "",
  });

  const filter = ref("");

  function onRequest(props: any) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;

    utcakStore.fetchPaginatedStreets({
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
      order: sortBy,
      sort: descending ? "-1" : "1",
      keyword: filter.value,
    });

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  }

  onMounted(() => {
    onRequest({
      pagination: pagination.value,
    });
  });
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:pagination="pagination"
        v-model:selected="utcakStore.selected"
        binary-state-sort
        :columns="columns"
        dense
        :filter="filter"
        row-key="_id"
        :rows="dataN"
        selection="multiple"
        title="Utcák"
        wrap-cells
        @request="onRequest"
      >
        <template #top-right>
          <q-input v-model="filter" debounce="300" dense placeholder="Search">
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <!-- Buttons:  -->
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn v-show="utcakStore.selected.length == 0" color="green" no-caps @click="newRecord">
          New record
        </q-btn>
        <q-btn v-show="utcakStore.selected.length == 1" color="blue" no-caps @click="editRecord">
          Edit record
        </q-btn>
        <q-btn v-show="utcakStore.selected.length != 0" color="red" no-caps @click="deleteRecord">
          {{
            utcakStore.selected.length > 1 ? "Delete selected records" : "Delete selected record"
          }}
        </q-btn>
      </div>
      {{ pagination }}
    </div>
  </q-page>
</template>

<style scoped></style>
