<script setup lang="ts">
  import { useAdosavokStore } from "../store/adosavokStore";
  import { storeToRefs } from "pinia";
  import router from "src/router";
  import { useUsersStore } from "../store/usersStore";

  const adosavokStore = useAdosavokStore();
  const usersStore = useUsersStore();

  const { isLoading, dataN, selected } = storeToRefs(adosavokStore);

  watch(isLoading, () => {
    adosavokStore.getAll();
  });

  function deleteRecord(): void {
    adosavokStore.deleteById();
  }

  function newRecord(): void {
    adosavokStore.data = {};
    router.push("/newTaxBand");
  }

  function editRecord(): void {
    adosavokStore.data = selected.value[0];
    adosavokStore.getById();
    router.push("/editTaxBand");
  }

  function clearSelection(): void {
    selected.value = [];
  }

  const columns: any[] = [
    { name: "_id", label: "_id", field: "_id", align: "left", sortable: true },
    { name: "sav", label: "sáv", field: "sav", align: "left", sortable: true },
    { name: "ado", label: "adó", field: "ado", align: "left", sortable: true },
    { name: "hatar", label: "határ", field: "hatar", align: "left", sortable: true },
  ];

  onMounted(() => {
    adosavokStore.getAll();
  });
</script>

<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-model:selected="selected"
        binary-state-sort
        :columns="columns"
        dense
        row-key="_id"
        :rows="dataN"
        selection="multiple"
        title="Tax bands"
        wrap-cells
      ></q-table>
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
          New record
        </q-btn>
        <q-btn v-show="selected.length == 1" color="blue" no-caps @click="editRecord">
          Edit record
        </q-btn>
        <q-btn v-show="selected.length != 0" color="red" no-caps @click="deleteRecord">
          {{ selected.length > 1 ? "Delete selected records" : "Delete selected record" }}
        </q-btn>
      </div>
      <!-- <p>Pagination object: {{ pagination }}</p> -->
      <!-- <p>Selected array: {{ selected }}</p> -->
      <!-- <div>Filter: "{{ pagination.filter }}"</div> -->
    </div>
  </q-page>
</template>

<style scoped></style>
