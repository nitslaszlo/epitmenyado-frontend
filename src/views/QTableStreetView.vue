<script setup lang="ts">
  import { onMounted, watch } from "vue";
  import { useAppStore } from "../store/appStore";
  import { useStreetsStore } from "../store/streetsStore";
  import { storeToRefs } from "pinia";
  import { QTableColumn } from "quasar";
  import StreetsDialog from "../components/StreetsDialog.vue";

  const appStore = useAppStore();
  const streetsStore = useStreetsStore();

  const { reloadCounter } = storeToRefs(streetsStore); // for watch changes and reload data

  watch(reloadCounter, () => {
    onRequest({
      pagination: streetsStore.pagination,
    });
  });

  function deleteRecord(): void {
    streetsStore.deleteById();
  }

  function newRecord(): void {
    streetsStore.data = {};
    appStore.isEditDocument = false;
    appStore.showDialog = true;
  }

  function filterChanged(): void {
    streetsStore.selected = [];
  }

  function editRecord(): void {
    streetsStore.data = streetsStore.selected[0];
    streetsStore.getById();
    appStore.isEditDocument = true;
    appStore.showDialog = true;
  }

  function clearSelection(): void {
    streetsStore.selected = [];
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

    streetsStore.fetchPaginatedStreets({
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
      order: sortBy,
      sort: descending ? "-1" : "1",
      keyword: filter,
    });

    // don't forget to update local pagination object
    streetsStore.pagination.page = page;
    streetsStore.pagination.rowsPerPage = rowsPerPage;
    streetsStore.pagination.sortBy = sortBy;
    streetsStore.pagination.descending = descending;
  }

  onMounted(() => {
    onRequest({
      pagination: streetsStore.pagination,
    });
  });
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:pagination="streetsStore.pagination"
        v-model:selected="streetsStore.selected"
        binary-state-sort
        :columns="columns"
        dense
        :filter="streetsStore.pagination.filter"
        :loading="streetsStore.isLoading"
        row-key="_id"
        :rows="streetsStore.dataN"
        selection="multiple"
        :title="$t('streets')"
        wrap-cells
        @request="onRequest"
      >
        <template #top-right>
          <q-input
            v-model="streetsStore.pagination.filter"
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
          v-show="streetsStore.selected.length != 0"
          color="orange"
          no-caps
          @click="clearSelection"
        >
          {{ streetsStore.selected.length > 1 ? "Clear selections" : "Clear selection" }}
        </q-btn>
        <q-btn color="green" no-caps @click="newRecord()">
          {{ $t("newDocument") }}
        </q-btn>
        <q-btn
          v-show="streetsStore.selected.length == 1"
          color="blue"
          no-caps
          @click="editRecord()"
        >
          {{ $t("editDocument") }}
        </q-btn>
        <q-btn
          v-show="streetsStore.selected.length != 0"
          color="red"
          no-caps
          @click="deleteRecord()"
        >
          {{
            streetsStore.selected.length > 1 ? "Delete selected records" : "Delete selected record"
          }}
        </q-btn>
      </div>
      <!-- <p>Pagination object: {{ pagination }}</p> -->
      <!-- <p>Selected array: {{ selected }}</p> -->
      <!-- <div>Filter: "{{ pagination.filter }}"</div> -->
    </div>

    <!-- Edit and New street document's dialog -->
    <StreetsDialog />
    <!-- Edit and New street document's dialog -->
  </q-page>
</template>

<style scoped></style>
