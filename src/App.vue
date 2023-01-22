<script setup lang="ts">
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";
  import router from "src/router";
  import { useUsersStore } from "./store/usersStore";
  import { useQuasar } from "quasar";

  const leftDrawer = ref<boolean>(true);
  const usersStore = useUsersStore();
  const $q = useQuasar();
  if ($q.screen.lt.md) {
    leftDrawer.value = false;
  }

  let { locale, t } = useI18n({
    inheritLocale: true,
    useScope: "global", // Change to "local" if you want to add <i18n></i18n> locally
  });

  const menuItems = ref([
    {
      icon: "mdi-home",
      text: t("startPage"),
      name: "startPage",
      route: "/",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-account",
      text: t("account"),
      name: "account",
      route: "/account",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-information",
      text: t("about"),
      name: "about",
      route: "/about",
      disabled: false,
      separator: true,
    },
  ]);

  function toggleLanguage() {
    locale.value = locale.value == "hu" ? "en" : "hu";
    menuItems.value.forEach((e) => {
      if (e.name != "") e.text = t(e.name);
    });
  }

  const links = ref([
    {
      icon: "mdi-github",
      text: "Frontend",
      name: "",
      link: "https://github.com/nitslaszlo/epitmenyado-frontend",
      disabled: false,
      separator: false,
    },
    {
      icon: "mdi-github",
      text: "Backend",
      name: "",
      link: "https://github.com/nitslaszlo/epitmenyado-backend",
      disabled: false,
      separator: false,
    },
  ]);
</script>

<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr fFf">
      <q-header class="bg-primary text-white text-left" elevated>
        <q-toolbar>
          <q-btn dense flat icon="mdi-menu" round @click="leftDrawer = !leftDrawer" />
          <q-toolbar-title id="title" style="cursor: pointer" @click="router.push({ path: '/startPage' })">
            <q-avatar>
              <img src="./assets/Jedlik_small.png" />
            </q-avatar>
            Építményadó 2022.05.16 (hu) -
            {{ usersStore.loggedUser ? usersStore.loggedUser?.name : $t("noUser") }}
          </q-toolbar-title>
          <q-btn flat icon="mdi-comment-text-multiple" @click="toggleLanguage">
            <q-badge color="red" floating>{{ locale }}</q-badge>
          </q-btn>
          <q-btn flat icon="mdi-theme-light-dark" @click="$q.dark.toggle" />
          <q-btn dense flat icon="mdi-menu" round @click="leftDrawer = !leftDrawer" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawer" bordered :breakpoint="500" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" show-if-above :width="200">
        <q-scroll-area class="fit">
          <!-- routes: -->
          <q-list>
            <template v-for="(menuItem, index) in menuItems" :key="index">
              <q-item clickable :disable="menuItem.disabled" @click="router.push(menuItem.route)">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.text }}
                </q-item-section>
              </q-item>
              <q-separator v-if="menuItem.separator" :key="'sep' + index" />
            </template>
            <q-item clickable :disable="usersStore.loggedUser == null" :to="{ name: 'qtablestreet' }">
              <q-item-section avatar>
                <q-icon name="mdi-table" />
              </q-item-section>
              <q-item-section>{{ t("editStreets") }}</q-item-section>
            </q-item>
            <q-item clickable :disable="usersStore.loggedUser == null" :to="{ name: 'qtabletaxband' }">
              <q-item-section avatar>
                <q-icon name="mdi-table" />
              </q-item-section>
              <q-item-section>{{ t("editTaxBands") }}</q-item-section>
            </q-item>
            <q-separator />
          </q-list>
          <!-- links: -->
          <q-list>
            <template v-for="(linkItem, index) in links" :key="index">
              <q-item clickable :href="linkItem.link" target="_blank">
                <q-item-section avatar>
                  <q-icon :name="linkItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ linkItem.text }}
                </q-item-section>
              </q-item>
              <q-separator v-if="linkItem.separator" :key="'sep' + index" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container id="container">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="slide-fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style lang="scss">
  .slide-fade-enter {
    transform: translateX(10px);
    opacity: 0;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.2s ease;
  }

  .slide-fade-leave-to {
    transform: translateX(-10px);
    opacity: 0;
  }

  #title {
    font-size: 10px;
    @media (min-width: 400px) {
      font-size: calc(10px + 0.5vw);
    }
    @media (min-width: 800px) {
      font-size: calc(14px + 0.5vw);
    }
    @media (min-width: 1200px) {
      font-size: calc(18px + 0.5vw);
    }
  }
</style>
