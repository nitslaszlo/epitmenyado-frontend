<script setup lang="ts">
  import { onMounted } from "vue";
  import { useAppStore } from "../store/appStore";
  import { useStreetsStore } from "../store/streetsStore";
  import { QTableColumn, QTableProps } from "quasar";
  import StreetsDialog from "../components/StreetsDialog.vue";
  import { useI18n } from "vue-i18n";

  const appStore = useAppStore();
  const streetsStore = useStreetsStore();

  let { t } = useI18n();

  function newRecord(): void {
    streetsStore.data = {};
    appStore.isEditDocument = false;
    appStore.showDialog = true;
  }

  function editRecord(): void {
    streetsStore.data = streetsStore.selected[0];
    streetsStore.getById();
    appStore.isEditDocument = true;
    appStore.showDialog = true;
  }

  function columns(): QTableColumn[] {
    let cols: QTableColumn[] = [
      // { name: "_id", label: "_id", field: "_id", align: "left", sortable: true },
      { name: "adoszam", label: t("taxNumber"), field: "adoszam", align: "left", sortable: true },
      {
        name: "adosav_id",
        label: t("taxBand"),
        field: (row: any) => row.adosav_id.sav,
        align: "center",
        sortable: true,
      },
      {
        name: "ado",
        label: t("tax"),
        field: (row: any) => row.adosav_id.ado,
        align: "center",
        sortable: true,
      },
      { name: "utca", label: t("street"), field: "utca", align: "left", sortable: true },
      { name: "hazszam", label: t("houseNumber"), field: "hazszam", align: "left", sortable: true },
      { name: "terulet", label: t("area"), field: "terulet", align: "left", sortable: true },
    ];
    return cols;
  }

  function onRequest(props: QTableProps) {
    if (props.pagination) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      streetsStore.pagination.page = page as number;
      streetsStore.pagination.rowsPerPage = rowsPerPage as number;
      streetsStore.pagination.sortBy = sortBy as string;
      streetsStore.pagination.descending = descending as boolean;

      streetsStore.fetchPaginatedStreets(); // get posts
    }
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
        :columns="columns()"
        dense
        :filter="streetsStore.pagination.filter"
        :loading="streetsStore.isLoading"
        :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex}/${totalRowsNumber}`"
        row-key="_id"
        :rows="streetsStore.dataN"
        :rows-per-page-label="$t('rowsPerPageLabel')"
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
            :placeholder="$t('search')"
            @update:model-value="streetsStore.selected = []"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <!-- Buttons:  -->
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn v-show="streetsStore.selected.length != 0" color="orange" no-caps @click="streetsStore.selected = []">
          {{ streetsStore.selected.length > 1 ? $t("clearSelections") : $t("clearSelection") }}
        </q-btn>
        <q-btn color="green" no-caps @click="newRecord()">
          {{ $t("newDocument") }}
        </q-btn>
        <q-btn v-show="streetsStore.selected.length == 1" color="blue" no-caps @click="editRecord()">
          {{ $t("editDocument") }}
        </q-btn>
        <q-btn v-show="streetsStore.selected.length != 0" color="red" no-caps @click="streetsStore.deleteById()">
          {{ streetsStore.selected.length > 1 ? $t("deleteSelectedDocuments") : $t("deleteSelectedDocument") }}
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
