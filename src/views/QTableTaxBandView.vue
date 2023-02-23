<script setup lang="ts">
  import { onMounted } from "vue";
  import { useAppStore } from "../store/appStore";
  import { useTaxBandsStore } from "../store/taxBandsStote";
  import { QTableColumn } from "quasar";
  import TaxBandsDialog from "../components/TaxBandsDialog.vue";
  import { useI18n } from "vue-i18n";

  const appStore = useAppStore();
  const taxBandsStore = useTaxBandsStore();

  let { t } = useI18n();

  function newRecord(): void {
    taxBandsStore.data = {};
    appStore.isEditDocument = false;
    appStore.showDialog = true;
  }

  function editRecord(): void {
    taxBandsStore.data = taxBandsStore.selected[0];
    taxBandsStore.getById();
    appStore.isEditDocument = true;
    appStore.showDialog = true;
  }

  function columns(): QTableColumn[] {
    let cols: QTableColumn[] = [
      // { name: "_id", label: "_id", field: "_id", align: "left", sortable: true },
      { name: "sav", label: t("taxBand"), field: "sav", align: "left", sortable: true },
      { name: "ado", label: t("tax"), field: "ado", align: "left", sortable: true },
      { name: "hatar", label: t("boundary"), field: "hatar", align: "left", sortable: true },
    ];
    return cols;
  }

  onMounted(() => {
    taxBandsStore.getAll();
  });
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:selected="taxBandsStore.selected"
        binary-state-sort
        :columns="columns()"
        dense
        :pagination="{ rowsPerPage: 10 }"
        row-key="_id"
        :rows="taxBandsStore.dataN"
        selection="multiple"
        :title="$t('taxBands')"
        wrap-cells
      ></q-table>
      <!-- Buttons:  -->
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn v-show="taxBandsStore.selected.length != 0" color="orange" no-caps @click="taxBandsStore.selected = []">
          {{ taxBandsStore.selected.length > 1 ? $t("clearSelections") : $t("clearSelection") }}
        </q-btn>
        <q-btn color="green" no-caps @click="newRecord">
          {{ $t("newDocument") }}
        </q-btn>
        <q-btn v-show="taxBandsStore.selected.length == 1" color="blue" no-caps @click="editRecord">
          {{ $t("editDocument") }}
        </q-btn>
        <q-btn v-show="taxBandsStore.selected.length != 0" color="red" no-caps @click="taxBandsStore.deleteById()">
          {{ taxBandsStore.selected.length > 1 ? $t("deleteSelectedDocuments") : $t("deleteSelectedDocument") }}
        </q-btn>
      </div>
    </div>
    <!-- Edit and New document's dialog -->
    <TaxBandsDialog />
    <!-- Edit and New document's dialog -->
  </q-page>
</template>

<style scoped></style>
