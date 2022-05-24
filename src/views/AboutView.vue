<script setup lang="ts"></script>

<template>
  <q-page>
    <div class="column flex-center">
      <img alt="Jedlik logo" class="q-ma-md" src="src/assets/Jedlik_big.png" />
      <h2>Jedlik Ányos Technikum - Győr</h2>
      <h2>{{ $t("aboutMsg") }}</h2>
      <h2>
        {{ $t("colorsOfTheme") }}
        <a href="https://quasar.dev/style/theme-builder" target="_blank">
          <q-chip>
            <q-avatar color="info" icon="bookmark" text-color="white" />
            Theme-builder
          </q-chip>
        </a>
      </h2>
    </div>
    <q-banner class="bg-primary text-white">Primary</q-banner>
    <q-banner class="bg-secondary text-white">Secondary</q-banner>
    <q-banner class="bg-accent text-white">Accent</q-banner>
    <q-banner class="bg-dark text-white">Dark</q-banner>
    <q-banner class="bg-positive text-white">Positive</q-banner>
    <q-banner class="bg-negative text-white">Negative</q-banner>
    <q-banner class="bg-info text-white">Info</q-banner>
    <q-banner class="bg-warning text-white">Warning</q-banner>
  </q-page>
</template>

<style scoped>
  h2 {
    color: gray;
    font-size: 2vw;
    margin: auto;
  }
  a {
    text-decoration: none;
  }
</style>
