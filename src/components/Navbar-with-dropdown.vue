<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <!--- menu --->
      <MobileMenuButton @toggle="toggleMobileMenu" :is-open="isMobileMenuOpen" />

      <!-- Logo -->
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/public/images/543-5439328_256gb-emmc-nand-storage-hd-png-download.png" class="h-8" alt="Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Blog của tôi</span>
      </a>

      <!-- User menu for authenticated users -->
      <div v-if="userStore.isAuthenticated" class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <UserDropdown />
      </div>

      <!-- Login button for non-authenticated users -->
      <div v-else class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <LoginButton />
      </div>

      <!-- Navigation menu -->
      <NavMenu :is-open="isMobileMenuOpen" :menu-items="menuItems" />
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../store/userStore";
import UserDropdown from "./UserDropdown.vue";
import MobileMenuButton from "./MobileMenuButton.vue";
import LoginButton from "./LoginButton.vue";
import NavMenu from "./NavMenu.vue";

const userStore = useUserStore();
const isMobileMenuOpen = ref(false);

const menuItems = [
  { name: "Home", href: "#", active: true },
  { name: "About", href: "#", active: false },
  { name: "Services", href: "#", active: false },
  { name: "Pricing", href: "#", active: false },
  { name: "Contact", href: "#", active: false },
];

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>
