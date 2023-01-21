<script setup lang="ts">
  import { onMounted, watch } from "vue";
  import { useAppStore } from "../store/appStore";
  import { useUtcakStore } from "../store/utcakStore";
  import { useUsersStore } from "../store/usersStore";
  import { storeToRefs } from "pinia";
  import { QTableColumn } from "quasar";
  import StreetDialog from "../components/StreetDialog.vue";

  const appStore = useAppStore();
  const utcakStore = useUtcakStore();
  const usersStore = useUsersStore();

  const { reloadCounter } = storeToRefs(utcakStore); // for watch changes and reload data

  watch(reloadCounter, () => {
    onRequest({
      pagination: utcakStore.pagination,
    });
  });

  function deleteRecord(): void {
    utcakStore.deleteById();
  }

  function newRecord(): void {
    utcakStore.data = {};
    appStore.isEditDocument = false;
    appStore.showDialog = true;
  }

  function filterChanged(): void {
    utcakStore.selected = [];
  }

  function editRecord(): void {
    utcakStore.data = utcakStore.selected[0];
    utcakStore.getById();
    appStore.isEditDocument = true;
    appStore.showDialog = true;
  }

  function clearSelection(): void {
    utcakStore.selected = [];
  }

  const columns: QTableColumn[] = [
    { name: "_id", label: "_id", field: "_id", align: "left", sortable: true },
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

  function onRequest(props: any) {
    const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;

    utcakStore.fetchPaginatedStreets({
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
      order: sortBy,
      sort: descending ? "-1" : "1",
      keyword: filter,
    });

    // don't forget to update local pagination object
    utcakStore.pagination.page = page;
    utcakStore.pagination.rowsPerPage = rowsPerPage;
    utcakStore.pagination.sortBy = sortBy;
    utcakStore.pagination.descending = descending;
  }

  onMounted(() => {
    onRequest({
      pagination: utcakStore.pagination,
    });
  });
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:pagination="utcakStore.pagination"
        v-model:selected="utcakStore.selected"
        binary-state-sort
        :columns="columns"
        dense
        :filter="utcakStore.pagination.filter"
        :loading="utcakStore.isLoading"
        row-key="_id"
        :rows="utcakStore.dataN"
        selection="multiple"
        :title="$t('streets')"
        wrap-cells
        @request="onRequest"
      >
        <template #top-right>
          <q-input
            v-model="utcakStore.pagination.filter"
            debounce="300"
            dense
            placeholder="Search"
            @update:model-value="filterChanged()"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <!-- Buttons:  -->
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn
          v-show="utcakStore.selected.length != 0"
          color="orange"
          no-caps
          @click="clearSelection"
        >
          {{ utcakStore.selected.length > 1 ? "Clear selections" : "Clear selection" }}
        </q-btn>
        <q-btn
          v-show="usersStore.loggedUser && utcakStore.selected.length == 0"
          color="green"
          no-caps
          @click="newRecord()"
        >
          {{ $t("newDocument") }}
        </q-btn>
        <q-btn v-show="utcakStore.selected.length == 1" color="blue" no-caps @click="editRecord()">
          {{ $t("editDocument") }}
        </q-btn>
        <q-btn v-show="utcakStore.selected.length != 0" color="red" no-caps @click="deleteRecord()">
          {{
            utcakStore.selected.length > 1 ? "Delete selected records" : "Delete selected record"
          }}
        </q-btn>
      </div>
      <!-- <p>Pagination object: {{ pagination }}</p> -->
      <!-- <p>Selected array: {{ selected }}</p> -->
      <!-- <div>Filter: "{{ pagination.filter }}"</div> -->
    </div>

    <!-- Edit and New street document's dialog -->
    <StreetDialog />
    <!-- Edit and New street document's dialog -->
  </q-page>
</template>

<style scoped></style>
