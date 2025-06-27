<template>
  <div class="relative" ref="dropdownRef">
    <button @click="toggleDropdown" class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" :aria-expanded="isOpen">
      <span class="sr-only">Open user menu</span>
      <img class="w-8 h-8 rounded-full" src="/public/images/600x600_9265699.jpg" alt="user photo" />
    </button>
    <div v-show="isOpen" class="absolute right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
      <div class="px-4 py-3">
        <span class="block text-sm text-gray-900 dark:text-white">{{ userStore.displayName }}</span>
        <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ userStore.email }}</span>
      </div>
      <ul class="py-2" aria-labelledby="user-menu-button">
        <li>
          <a href="javascript:void(0)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
        </li>
        <li>
          <a href="javascript:void(0)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
        </li>
        <li>
          <a href="javascript:void(0)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
        </li>
        <li>
          <a href="javascript:void(0)" @click="userStore.logoutUser()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from "../store/userStore";

const userStore = useUserStore();
const isOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>