<script setup lang="ts">
  import { useUtcakStore } from "../store/utcakStore";
  import { useAdosavokStore } from "../store/adosavokStore";
  import router from "src/router";

  const utcakStore = useUtcakStore();
  const adosavokStore = useAdosavokStore();

  onMounted(() => {
    adosavokStore.getAll();
  });

  function Submit() {
    utcakStore.editById();
  }

  function Reset() {
    router.push("/qtable");
  }
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div v-if="utcakStore.data" class="col-12 col-sm-8 col-md-6 col-lg-4 q-gutter-md">
        <q-form class="q-gutter-md" @reset="Reset()" @submit="Submit">
          <h4 class="text-center q-mt-lg q-mb-none">Edit record</h4>
          <q-select
            v-model="utcakStore.data.adosav"
            clearable
            emit-value
            filled
            label="Adósáv:"
            map-options
            option-label="sav"
            option-value="_id"
            :options="adosavokStore.dataN"
          />
          <q-input v-model="utcakStore.data.adoszam" filled label="Adószám:" type="text" />
          <q-input v-model="utcakStore.data.utca" filled label="Utca:" type="text" />
          <q-input v-model="utcakStore.data.hazszam" filled label="Házszám:" type="text" />
          <q-input v-model="utcakStore.data.terulet" filled label="Terület:" type="number" />
          <div class="row justify-center">
            <q-btn class="q-mr-md" color="green" label="Mentés" no-caps type="submit" />
            <q-btn class="q-mr-md" color="red" label="Mégsem" no-caps type="reset" />
          </div>
          <p>Actual: {{ utcakStore.data }}</p>
          <p>Old: {{ utcakStore.dataOld }}</p>
          <p>Selected: {{ utcakStore.selected }}</p>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
