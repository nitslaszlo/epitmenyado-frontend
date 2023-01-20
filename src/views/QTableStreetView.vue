<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";
  import { useUtcakStore } from "../store/utcakStore";
  import { useAdosavokStore } from "../store/adosavokStore";
  import { storeToRefs } from "pinia";
  import { useUsersStore } from "../store/usersStore";
  import { QTableColumn } from "quasar";

  const utcakStore = useUtcakStore();
  const usersStore = useUsersStore();
  const adosavokStore = useAdosavokStore();

  const { isLoading, dataN, pagination, selected } = storeToRefs(utcakStore);

  const showDialog = ref(false);
  const isEditDocument = ref(false);

  watch(isLoading, () => {
    onRequest({
      pagination: pagination.value,
    });
  });

  function deleteRecord(): void {
    utcakStore.deleteById();
  }

  function newRecord(): void {
    utcakStore.data = {};
    isEditDocument.value = false;
    showDialog.value = true;
  }

  function filterChanged(): void {
    selected.value = [];
  }

  function editRecord(): void {
    utcakStore.data = selected.value[0];
    utcakStore.getById();
    isEditDocument.value = true;
    showDialog.value = true;
  }

  function clearSelection(): void {
    selected.value = [];
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

  function Submit() {
    if (isEditDocument.value) utcakStore.editById();
    else utcakStore.create();
  }

  function Reset() {
    utcakStore.data = { ...utcakStore.dataOld };
  }

  function Close() {
    onRequest({
      pagination: pagination.value,
    });
    showDialog.value = false;
  }

  function BeforeShowDialog() {
    adosavokStore.getAll();
  }
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:pagination="pagination"
        v-model:selected="selected"
        binary-state-sort
        :columns="columns"
        dense
        :filter="pagination.filter"
        row-key="_id"
        :rows="dataN"
        selection="multiple"
        :title="$t('streets')"
        wrap-cells
        @request="onRequest"
      >
        <template #top-right>
          <q-input
            v-model="pagination.filter"
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
        <q-btn v-show="selected.length != 0" color="orange" no-caps @click="clearSelection">
          {{ selected.length > 1 ? "Clear selections" : "Clear selection" }}
        </q-btn>
        <q-btn
          v-show="usersStore.loggedUser && selected.length == 0"
          color="green"
          no-caps
          @click="newRecord"
        >
          {{ $t("newDocument") }}
        </q-btn>
        <q-btn v-show="selected.length == 1" color="blue" no-caps @click="editRecord">
          {{ $t("editDocument") }}
        </q-btn>
        <q-btn v-show="selected.length != 0" color="red" no-caps @click="deleteRecord">
          {{ selected.length > 1 ? "Delete selected records" : "Delete selected record" }}
        </q-btn>
      </div>
      <!-- <p>Pagination object: {{ pagination }}</p> -->
      <!-- <p>Selected array: {{ selected }}</p> -->
      <!-- <div>Filter: "{{ pagination.filter }}"</div> -->
    </div>

    <!-- Edit and New document's dialog -->
    <q-dialog v-model="showDialog" persistent @before-show="BeforeShowDialog()">
      <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
        <q-form class="q-mx-md" @reset="Reset()" @submit="Submit">
          <div class="row">
            <div v-if="utcakStore.data" class="col-12 q-gutter-md">
              <h4 class="text-center q-mt-lg q-mb-none">
                {{ `${isEditDocument ? "Edit" : "New"} document` }}
              </h4>
              <q-input
                v-if="!isEditDocument"
                v-model.number="utcakStore.data._id"
                filled
                label="_id:"
                type="number"
              />
              <q-select
                v-model="utcakStore.data.adosav"
                clearable
                emit-value
                filled
                label="Adósáv:"
                map-options
                option-label="sav"
                option-value="_id"
                :options="adosavokStore.dataN.sort((a, b) => a.sav!.localeCompare(b.sav!))"
              />
              <q-input v-model="utcakStore.data.adoszam" filled label="Adószám:" type="text" />
              <q-input v-model="utcakStore.data.utca" filled label="Utca:" type="text" />
              <q-input v-model="utcakStore.data.hazszam" filled label="Házszám:" type="text" />
              <q-input v-model="utcakStore.data.terulet" filled label="Terület:" type="number" />
              <div class="row justify-center">
                <q-btn class="q-mr-md" color="green" label="Mentés" no-caps type="submit" />
                <q-btn class="q-mr-md" color="red" label="Visszaállítás" no-caps type="reset" />
                <q-btn class="q-mr-md" color="blue" label="Bezár" no-caps @click="Close()" />
              </div>
              <!-- <p>Actual: {{ utcakStore.data }}</p> -->
              <!-- <p>Old: {{ utcakStore.dataOld }}</p> -->
              <!-- <p>Selected: {{ utcakStore.selected }}</p> -->
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped></style>
