<script setup lang="ts">
  import { useAppStore } from "../store/appStore";
  import { useStreetsStore } from "../store/streetsStore";
  import { useTaxBandsStore } from "../store/taxBandsStote";

  const appStore = useAppStore();
  const utcakStore = useStreetsStore();
  const adosavokStore = useTaxBandsStore();

  function Submit() {
    if (appStore.isEditDocument) utcakStore.editById();
    else utcakStore.create();
  }

  function Reset() {
    utcakStore.data = { ...utcakStore.dataOld };
  }

  function Close() {
    appStore.showDialog = false;
  }

  function BeforeShowDialog() {
    adosavokStore.getAll();
  }
</script>

<template>
  <q-dialog v-model="appStore.showDialog" persistent @before-show="BeforeShowDialog()">
    <q-card class="q-pa-md" style="width: 60vw; min-width: 300px">
      <q-form class="q-mx-md" @reset="Reset()" @submit="Submit">
        <div class="row">
          <div v-if="utcakStore.data" class="col-12 q-gutter-md">
            <h4 class="text-center q-mt-lg q-mb-none">
              {{ `${appStore.isEditDocument ? "Edit" : "New"} document` }}
            </h4>
            <q-input v-if="!appStore.isEditDocument" v-model.number="utcakStore.data._id" filled label="_id:" type="number" />
            <q-select
              v-model="utcakStore.data._id"
              clearable
              emit-value
              filled
              :label="$t('taxBand')"
              map-options
              option-label="sav"
              option-value="_id"
              :options="adosavokStore.dataN.sort((a, b) => a.sav!.localeCompare(b.sav!))"
            />
            <q-input v-model.number="utcakStore.data.adoszam" filled :label="$t('taxNumber')" type="text" />
            <q-input v-model="utcakStore.data.utca" filled :label="$t('street')" type="text" />
            <q-input v-model="utcakStore.data.hazszam" filled :label="$t('houseNumber')" type="text" />
            <q-input v-model.number="utcakStore.data.terulet" filled :label="$t('area')" type="number" />
            <div class="row justify-center">
              <q-btn class="q-mr-md" color="green" label="Mentés" no-caps type="submit" />
              <q-btn class="q-mr-md" color="red" label="Visszaállítás" no-caps type="reset" />
              <q-btn class="q-mr-md" color="blue" label="Bezár" no-caps @click="Close()" />
            </div>
            <p>Actual: {{ utcakStore.data }}</p>
            <!-- <p>Old: {{ utcakStore.dataOld }}</p> -->
            <!-- <p>Selected: {{ utcakStore.selected }}</p> -->
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
