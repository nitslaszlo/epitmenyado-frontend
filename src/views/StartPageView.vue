/* eslint-disable @typescript-eslint/no-non-null-assertion */
<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";
  import { useStreetsStore } from "../store/streetsStore";
  import { storeToRefs } from "pinia";
  import { useTaxBandsStore } from "../store/taxBandsStote";
  import TxtWritter from "../components/TxtWriter.vue";

  const utcakStore = useStreetsStore();
  const adosavokStore = useTaxBandsStore();
  const utcakStat = new Map<string, string>();
  const fizetendoAdo = new Map<number, number>();
  const fizetendoTxt = ref("");
  const newUtcaTxt = ref("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ISav {
    sav: string;
    ado: number;
    hatar: number;
  }

  function ado(sav: any, terulet: any): number {
    const adosav: any[] = adosavokStore.dataN.filter((x) => x.sav == sav.sav);
    if (adosav[0]) {
      const ado: number = adosav[0].ado * terulet;
      return ado < 10000 ? 0 : ado;
    } else {
      return -1;
    }
  }

  const { data, dataN, dataNfiltered } = storeToRefs(utcakStore);

  // ha az input adószám megváltozik:
  watch(data.value, () => {
    dataNfiltered.value = dataN.value.filter((x) => x.adoszam == data.value.adoszam);
  });

  // ha betöltődnek/változnak az utcák adatai:
  watch(dataN, () => {
    dataNfiltered.value = dataN.value.filter((x) => x.adoszam == data.value.adoszam);
    for (const item of dataN.value) {
      const aktUtca: string = item.utca as string;
      const aktAdosáv: ISav = item.adosav_id as ISav;
      if (!utcakStat.has(aktUtca)) {
        utcakStat.set(aktUtca, aktAdosáv.sav);
      } else {
        if (utcakStat.get(aktUtca)?.indexOf(aktAdosáv.sav) == -1) {
          utcakStat.set(aktUtca, utcakStat.get(aktUtca) + aktAdosáv.sav);
        }
      }
    }
    // fizetendo.txt állományhoz a fizetendoTxt tartalmának összeállítása
    for (const item of dataN.value) {
      const aktAdosáv: ISav = item.adosav_id as ISav;
      const adószám: number = item.adoszam as number;
      const terület: number = item.terulet as number;
      if (!fizetendoAdo.has(adószám)) {
        // első ingatlan adója:
        fizetendoAdo.set(adószám, ado(aktAdosáv, terület));
      } else {
        // többi ingatlan adója:
        const korábbiIngatlanokAdója: number = fizetendoAdo.get(adószám) as number;
        fizetendoAdo.set(adószám, korábbiIngatlanokAdója + ado(aktAdosáv, terület));
      }
    }
    for (const item of fizetendoAdo) {
      const adószám: number = item[0]; // key
      const összesAdó: number = item[1]; // value
      fizetendoTxt.value += `${adószám} ${összesAdó}\r\n`;
    }

    // Nem a megoldás része:
    // Az új utca.txt állományhoz a newUtcaTxt tartalmának összeállítása
    // Az első sorban lévő adóösszegek:
    const elsoSor: string[] = [];
    for (const item of adosavokStore.dataN.sort((a, b) => (b.ado as number) - (a.ado as number))) {
      elsoSor.push(`${item.ado}`);
    }
    newUtcaTxt.value = elsoSor.join(" ") + "\r\n";

    // A 2. sortól az útcák és a házszámok
    for (const e of dataN.value.sort((a, b) =>
      `${a.utca} ${a.hazszam}`.localeCompare(`${b.utca} ${b.hazszam}`, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    )) {
      const aktAdosáv: string = (e.adosav_id as ISav).sav;
      newUtcaTxt.value += `${e.adoszam} ${e.utca} ${e.hazszam} ${aktAdosáv} ${e.terulet}\r\n`;
    }
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
          <h4 class="text-center q-mt-lg q-mb-none">Építményadó feladat megoldása (2023)</h4>
          <p>2. feladat. A mintában {{ dataN.length }} telek szerepel.</p>
          <p>3. feladat.</p>
          <q-input v-model="utcakStore.data.adoszam" filled label="Egy tulajdonos adószáma" type="number" />
          <div v-if="dataNfiltered.length > 0">
            <span v-for="(item, index) in dataNfiltered" :key="index">
              {{ item.utca }} utca {{ item.hazszam }}
              <br />
            </span>
          </div>
          <div v-else><span>Nem szerepel az adatállományban</span></div>
          <p>5. feladat.</p>
          <span v-for="(item, index) in adosavokStore.dataN.sort((a, b) => a.sav!.localeCompare(b.sav!))" :key="index">
            {{ item.sav }} sávba
            {{ utcakStore.dataN.filter((x) => (x.adosav_id as ISav).sav == item.sav).length }}
            telek esik, az adó
            {{ utcakStore.dataN.filter((x) => (x.adosav_id as ISav).sav == item.sav).reduce((p, c) => p + ado(c.adosav_id, c.terulet), 0) }}
            Ft.
            <br />
          </span>
          <p>6. feladat. A több sávba sorolt utcák:</p>
          <template v-for="(item, index) in utcakStat" :key="index">
            <template v-if="item[1].length > 1">
              <span>{{ item[0] }}</span>
              <br />
            </template>
          </template>
          <p>7. feladat.</p>
          <TxtWritter :content="fizetendoTxt" filename="fizetendo.txt" title="fizetendo.txt írása" />
          <TxtWritter :content="newUtcaTxt" filename="utca.txt" title="utca.txt írása a NoSQL adatbázisból" />
        </q-form>
        <!-- <p>fizetendoAdó: {{ fizetendoTxt }}</p> -->
        <!-- <p>Data filtered: {{ dataNfiltered }}</p> -->
        <!-- <p>Utcak stat: {{ utcakStat }}</p> -->
        <!-- <p>All data: {{ dataN }}</p> -->
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
