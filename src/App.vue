<template>
  <div class="flex flex-col min-h-screen">
    <NavbarWithDropdown />
    <main class="flex-grow">
      <router-view />
    </main>
    <footer class="bg-white shadow mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-gray-500">© {{ new Date().getFullYear() }} Blog của tôi. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "../src/store/userStore";
import NavbarWithDropdown from "./components/Navbar-with-dropdown.vue";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.getUser();
});
</script>
