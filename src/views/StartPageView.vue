<script setup lang="ts">
  import { useUtcakStore } from "../store/utcakStore";
  import { storeToRefs } from "pinia";
  import { useAdosavokStore } from "../store/adosavokStore";

  const utcakStore = useUtcakStore();
  const adosavokStore = useAdosavokStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ISav {
    sav: string;
    ado: number;
    hatar: number;
  }

  function ado(sav: any, terulet: any): number {
    const adosav: any[] = adosavokStore.dataN.filter((x) => x.sav == sav.sav);
    const ado: number = adosav[0].ado * terulet;
    return ado < 10000 ? 0 : ado;
  }

  const { data, dataN, dataNfiltered } = storeToRefs(utcakStore);

  watch(data.value, () => {
    dataNfiltered.value = dataN.value.filter((x) => x.adoszam == data.value.adoszam);
  });

  watch(dataN, () => {
    dataNfiltered.value = dataN.value.filter((x) => x.adoszam == data.value.adoszam);
  });

  onMounted(() => {
    utcakStore.getAll();
    adosavokStore.getAll();
    data.value.adoszam = 68396;
  });
</script>
<template>
  <q-page>
    <div class="row justify-center">
      <div v-if="utcakStore.dataN" class="col-12 col-sm-8 col-md-6 col-lg-4 q-gutter-md">
        <q-form class="q-gutter-md">
          <h4 class="text-center q-mt-lg q-mb-none">A feladat megoldása</h4>
          <p>2. feladat. A mintában {{ dataN.length }} telek szerepel.</p>
          <p>3. feladat.</p>
          <q-input
            v-model="utcakStore.data.adoszam"
            filled
            label="Egy tulajdonos adószáma"
            type="number"
          />
          <div v-if="dataNfiltered.length > 0">
            <span v-for="(item, index) in dataNfiltered" :key="index">
              {{ item.utca }} utca {{ item.hazszam }} ( Éves adó:
              {{ ado(item.adosav, item.terulet) }} Ft )
              <br />
            </span>
          </div>
          <div v-else><span>Nem szerepel az adatállományban</span></div>
          <p>5. feladat.</p>
          <span
            v-for="(item, index) in adosavokStore.dataN.sort((a, b) => a.sav!.localeCompare(b.sav!))"
            :key="index"
          >
            {{ item.sav }} sávba
            {{ utcakStore.dataN.filter((x) => ((x.adosav! as ISav).sav == item.sav)).length }}
            telek esik, az adó
            {{ utcakStore.dataN.filter((x) => ((x.adosav! as ISav).sav == item.sav)).reduce((p, c) => p + ado(c.adosav, c.terulet), 0) }}
            Ft.
            <br />
          </span>
          <p>6. feladat. A több sávba sorolt utcák:</p>
          {{ utcakStore }}
        </q-form>
        <p>Data filtered: {{ dataNfiltered }}</p>
        <p>All data: {{ dataN }}</p>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
