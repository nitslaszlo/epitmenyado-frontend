<script setup lang="ts">
  import { useAppStore } from "../store/appStore";
  import { useTaxBandsStore } from "../store/taxBandsStote";

  const appStore = useAppStore();
  const adosavokStore = useTaxBandsStore();

  function CloseDialog() {
    // adosavokStore.getAll();
    appStore.showDialog = false;
  }

  function SubmitDialog() {
    if (appStore.isEditDocument) adosavokStore.editById();
    else adosavokStore.create();
  }

  function ResetDialog() {
    adosavokStore.data = { ...adosavokStore.dataOld };
  }
</script>

<template>
  <q-dialog v-model="appStore.showDialog" persistent>
    <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
      <q-form class="q-mx-md" @reset="ResetDialog()" @submit="SubmitDialog()">
        <div class="row">
          <div v-if="adosavokStore.data" class="col-12 q-gutter-md">
            <h4 class="text-center q-mt-lg q-mb-none">
              {{ `${appStore.isEditDocument ? "Edit" : "New"} document` }}
            </h4>
            <q-input v-if="!appStore.isEditDocument" v-model.number="adosavokStore.data._id" filled label="_id:" type="number" />
            <q-input v-model="adosavokStore.data.sav" filled label="Sáv:" type="text" />
            <q-input v-model.number="adosavokStore.data.ado" filled label="Adó:" type="number" />
            <q-input v-model.number="adosavokStore.data.hatar" filled label="Határ:" type="number" />
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
</template>

<style lang="scss" scoped></style>
