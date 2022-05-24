<script setup lang="ts">
  const props = defineProps({
    initial: {
      type: Number,
      required: true,
    },
  });
  const count = ref(props.initial);
  const doubledCount = computed(() => count.value * 2);
</script>

<template>
  <q-card class="bg-warning">
    <q-card-actions>
      <h5>+ Counter component</h5>
      <q-space />
      <q-btn color="negative" no-caps @click="count++">Count UP</q-btn>
    </q-card-actions>
    <q-card-section class="text-center">
      <h2>"{{ count }}"</h2>
      <h5>Douple is {{ doubledCount }}</h5>
    </q-card-section>
  </q-card>
</template>

<style scoped>
  h2,
  h5 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
