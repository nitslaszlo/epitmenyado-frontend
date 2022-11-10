<script setup lang="ts">
  import { onMounted } from "vue";
  // import { useUtcakStore } from "../store/utcakStore";
  import { useAdosavokStore } from "../store/adosavokStore";
  import router from "src/router";

  // const utcakStore = useUtcakStore();
  const adosavokStore = useAdosavokStore();

  onMounted(() => {
    // empty
  });

  function Submit() {
    adosavokStore.create();
  }

  function Reset() {
    router.push("/qtabletaxband");
  }
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <div v-if="adosavokStore.data" class="col-12 col-sm-8 col-md-6 col-lg-4 q-gutter-md">
        <q-form class="q-gutter-md" @reset="Reset()" @submit="Submit">
          <h4 class="text-center q-mt-lg q-mb-none">New record</h4>
          <q-input v-model.number="adosavokStore.data._id" filled label="_id:" type="number" />
          <q-input v-model="adosavokStore.data.sav" filled label="Sáv:" type="text" />
          <q-input v-model.number="adosavokStore.data.ado" filled label="Adó:" type="number" />
          <q-input v-model.number="adosavokStore.data.hatar" filled label="Határ:" type="number" />
          <div class="row justify-center">
            <q-btn class="q-mr-md" color="green" label="Mentés" no-caps type="submit" />
            <q-btn class="q-mr-md" color="red" label="Mégsem" no-caps type="reset" />
          </div>
          <p>Actual: {{ adosavokStore.data }}</p>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
