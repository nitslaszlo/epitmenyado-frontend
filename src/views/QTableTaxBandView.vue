<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { useAdosavokStore } from "../store/adosavokStore";
  import { useUsersStore } from "../store/usersStore";
  import { QTableColumn } from "quasar";

  const adosavokStore = useAdosavokStore();
  const usersStore = useUsersStore();

  const showDialog = ref(false);
  const isEditDocument = ref(false);

  function deleteRecord(): void {
    adosavokStore.deleteById();
  }

  function newRecord(): void {
    adosavokStore.data = {};
    isEditDocument.value = false;
    showDialog.value = true;
  }

  function editRecord(): void {
    adosavokStore.data = adosavokStore.selected[0];
    adosavokStore.getById();
    isEditDocument.value = true;
    showDialog.value = true;
  }

  function clearSelection(): void {
    adosavokStore.selected = [];
  }

  const columns: QTableColumn[] = [
    { name: "_id", label: "_id", field: "_id", align: "left", sortable: true },
    { name: "sav", label: "sáv", field: "sav", align: "left", sortable: true },
    { name: "ado", label: "adó", field: "ado", align: "left", sortable: true },
    { name: "hatar", label: "határ", field: "hatar", align: "left", sortable: true },
  ];

  onMounted(() => {
    adosavokStore.getAll();
  });

  function CloseDialog() {
    // adosavokStore.getAll();
    showDialog.value = false;
  }

  function SubmitDialog() {
    if (isEditDocument.value) adosavokStore.editById();
    else adosavokStore.create();
  }

  function ResetDialog() {
    adosavokStore.data = { ...adosavokStore.dataOld };
  }
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:selected="adosavokStore.selected"
        binary-state-sort
        :columns="columns"
        dense
        :pagination="{ rowsPerPage: 10 }"
        row-key="_id"
        :rows="adosavokStore.dataN"
        selection="multiple"
        :title="$t('taxBands')"
        wrap-cells
      ></q-table>
      <!-- Buttons:  -->
      <div class="row justify-center q-ma-sm q-gutter-sm">
        <q-btn
          v-show="adosavokStore.selected.length != 0"
          color="orange"
          no-caps
          @click="clearSelection"
        >
          {{ adosavokStore.selected.length > 1 ? "Clear selections" : "Clear selection" }}
        </q-btn>
        <q-btn
          v-show="usersStore.loggedUser && adosavokStore.selected.length == 0"
          color="green"
          no-caps
          @click="newRecord"
        >
          {{ $t("newDocument") }}
        </q-btn>
        <q-btn v-show="adosavokStore.selected.length == 1" color="blue" no-caps @click="editRecord">
          {{ $t("editDocument") }}
        </q-btn>
        <q-btn
          v-show="adosavokStore.selected.length != 0"
          color="red"
          no-caps
          @click="deleteRecord"
        >
          {{
            adosavokStore.selected.length > 1 ? "Delete selected records" : "Delete selected record"
          }}
        </q-btn>
      </div>
    </div>
    <!-- Edit and New document's dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
        <q-form class="q-mx-md" @reset="ResetDialog()" @submit="SubmitDialog">
          <div class="row">
            <div v-if="adosavokStore.data" class="col-12 q-gutter-md">
              <h4 class="text-center q-mt-lg q-mb-none">
                {{ `${isEditDocument ? "Edit" : "New"} document` }}
              </h4>
              <q-input
                v-if="!isEditDocument"
                v-model.number="adosavokStore.data._id"
                filled
                label="_id:"
                type="number"
              />
              <q-input v-model="adosavokStore.data.sav" filled label="Sáv:" type="text" />
              <q-input v-model.number="adosavokStore.data.ado" filled label="Adó:" type="number" />
              <q-input
                v-model.number="adosavokStore.data.hatar"
                filled
                label="Határ:"
                type="number"
              />
              <div class="row justify-center">
                <q-btn class="q-mr-md" color="green" label="Mentés" no-caps type="submit" />
                <q-btn class="q-mr-md" color="red" label="Visszaállítás" no-caps type="reset" />
                <q-btn class="q-mr-md" color="red" label="Bezár" no-caps @click="CloseDialog()" />
              </div>
              <p>Actual: {{ adosavokStore.data }}</p>
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped></style>
