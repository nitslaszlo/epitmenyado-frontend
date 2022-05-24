<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      default: "Delete record",
    },
    message: {
      type: String,
      default: "Are yue sure?",
    },
    okBtn: {
      type: String,
      default: "Yes",
    },
    cancelBtn: {
      type: String,
      default: "No",
    },
    result: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(["update:modelValue", "update:result", "close"]);

  const show = computed({
    get() {
      return props.modelValue;
    },
    set(value: boolean) {
      return emit("update:modelValue", value);
    },
  });

  const res = computed({
    get() {
      return props.result;
    },
    set(value: boolean) {
      return emit("update:result", value);
    },
  });

  function pressOk() {
    res.value = true;
    show.value = false;
    emit("close");
  }

  function pressCancel() {
    res.value = false;
    show.value = false;
    emit("close");
  }
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent :retain-focus="false" transition="fab-transition">
      <v-card>
        <v-card-title class="text-h5">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-lighten-3" @click="pressOk">{{ okBtn }}</v-btn>
          <v-btn color="red-lighten-3" @click="pressCancel">{{ cancelBtn }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
