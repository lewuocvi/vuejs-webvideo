<template>
  <template v-if="$route.meta.layout !== 'none'">
    <HeaderComponent />
    <main class="flex-1 p-4 overflow-y-auto mt-10">
      <router-view />
    </main>
    <footer class="bg-white shadow mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-gray-500">© {{ new Date().getFullYear() }} Blog của tôi. All rights reserved.</div>
    </footer>
  </template>

  <template v-else>
    <router-view />
  </template>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "../src/store/userStore";
import HeaderComponent from "./components/HeaderComponent.vue";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.getUser();
});
</script>
