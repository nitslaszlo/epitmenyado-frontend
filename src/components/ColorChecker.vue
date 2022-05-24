<script setup lang="ts">
  const color = ref("lightblue");
</script>

<template>
  <q-form class="bg-info q-mt-lg">
    <p class="q-ma-xs">ColorChecker component</p>
    <div class="row">
      <div class="col-xs-12 col-md-6 q-pa-md">
        <q-input v-model="color" label="Change the color:" outlined type="text">
          <template #prepend>
            <q-icon name="mdi-palette" />
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-md-6 q-pa-md">
        <q-banner class="box shadow-6" rounded>{{ color }}</q-banner>
      </div>
    </div>
  </q-form>
</template>

<style scoped>
  .box {
    background-color: v-bind(color);
    border: 3px solid rgba(0, 0, 0, 0.15);
  }
</style>
