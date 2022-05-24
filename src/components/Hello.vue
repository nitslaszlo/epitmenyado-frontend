<script setup lang="ts">
  const times = ref(2);
  const props = defineProps<{ count: number }>();
  const result = computed(() => props.count * times.value);
  defineExpose(props);
</script>

<template>
  <div>{{ count }} x {{ times }} = {{ result }}</div>
  <button id="plusBtn" @click="times += 1">plus</button>
  <button id="minusBtn" @click="times -= 1">minus</button>
</template>
