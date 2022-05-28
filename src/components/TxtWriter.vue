<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  });

  function writeTextToFile(): void {
    const textFileAsBlob = new Blob(["\ufeff", props.content], { type: "text/plain" });
    const downloadLink = document.createElement("a");
    downloadLink.download = props.filename;
    downloadLink.innerHTML = "Download File"; // Elhagyható?
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = (e) => document.body.removeChild(e.target as Node);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
</script>

<template>
  <q-btn color="red" icon="mdi-content-save" :label="title" no-caps @click="writeTextToFile()" />
  <!-- <label class="text-writer">
    {{ title }}
    <input type="button" @click="writeTextToFile()" />
  </label> -->
</template>

<style scoped></style>
