<script setup lang="ts">
  import { useUtcakStore } from "../store/utcakStore";

  const utcakStore = useUtcakStore();
  // Selected row(s) -> selection="single" or selection="multiple"
  // const selected = ref<any>([]);

  function deleteRecord(): void {
    utcakStore.deleteById();
    // for (const e of selected.value) {
    //   utcakStore.data._id = e._id;
    //   await utcakStore.deleteById().then(() => {
    //     selected.value = selected.value.filter((t: any) => {
    //       t._id != e._id;
    //     });
    //     if (selected.value.length == 0) {
    //       onRequest({
    //         pagination: pagination.value,
    //       });
    //     }
    //   });

    //  utcakStore.selected = [];
    // onRequest({
    //   pagination: pagination.value,
    // });
    // if (utcakStore.dataN) pagination.value.rowsNumber = utcakStore.numberOfStreets;
  }

  function newRecord(): void {
    // pass
  }

  function editRecord(): void {
    // pass
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

  // watch(utcakStore, () => {
  //   pagination.value.rowsNumber = utcakStore.numberOfStreets;
  // onRequest({
  //   pagination: pagination.value,
  // });
  // });

  watch(utcakStore.refreshNeeded.valueOf, () => {
    pagination.value.rowsNumber = utcakStore.numberOfStreets;
    onRequest({
      pagination: pagination.value,
    });
  });

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
        :rows="utcakStore.dataN"
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
        <!-- slot1: -->
        <!-- <template #body-cell-boolField="props">
          <q-td :props="props">
            <q-badge v-if="props.value" color="green" label="Yes" outline />
            <q-badge v-else color="red" label="No" outline />
          </q-td>
        </template> -->
        <!-- slot2: -->
        <!-- <template #body-cell-imgField="props">
          <q-td :props="props">
            <img :src="props.value" style="max-height: 100px" />
          </q-td>
        </template> -->
      </q-table>
      <!-- Button for delete selected record: -->
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
    </div>
  </q-page>
</template>

<style scoped></style>
