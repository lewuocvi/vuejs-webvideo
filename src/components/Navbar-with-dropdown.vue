<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/public/images/543-5439328_256gb-emmc-nand-storage-hd-png-download.png" class="h-8" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Blog của tôi</span>
      </a>

      <div v-if="userStore.isAuthenticated" class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <div class="relative" ref="dropdownRef">
          <button type="button" class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" @click="toggleDropdown" :aria-expanded="isDropdownOpen">
            <span class="sr-only">Open user menu</span>
            <img class="w-8 h-8 rounded-full" src="/public/images/600x600_9265699.jpg" alt="user photo" />
          </button>
          <!-- Dropdown menu -->
          <div v-show="isDropdownOpen" class="absolute right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
            <div class="px-4 py-3">
              <span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
              <span class="block text-sm text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
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
        <button @click="toggleMobileMenu" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" :aria-expanded="isMobileMenuOpen">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>

      <div v-else class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <button onclick="my_modal_3.showModal()" class="btn bg-white text-black border-[#e5e5e5]">
          <svg aria-label="Email icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="black">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          Login with Email
        </button>
      </div>

      <div :class="['items-center justify-between w-full md:flex md:w-auto md:order-1', { hidden: !isMobileMenuOpen }]" id="navbar-user">
        <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li v-for="(item, index) in menuItems" :key="index">
            <a :href="item.href" :class="['block py-2 px-3 rounded-sm md:p-0', item.active ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700']" :aria-current="item.active ? 'page' : undefined">{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <dialog id="my_modal_3" class="modal">
    <div class="modal-box p-0 w-auto">
      <div class="card bg-base-100 card-border border-base-300 card-sm overflow-hidden">
        <div class="border-base-300 border-b border-dashed">
          <div class="flex items-center gap-2 p-4">
            <div class="grow">
              <div class="flex items-center gap-2 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"></path></svg> Create new account
              </div>
            </div>
          </div>
        </div>
        <div class="card-body gap-4">
          <p class="text-xs opacity-60">Registration is free and only takes a minute</p>
          <div class="flex flex-col gap-1">
            <label class="input input-border flex max-w-none items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"></path>
              </svg>
              <input type="email" v-model="email" class="grow" placeholder="email" />
            </label>
          </div>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div class="flex flex-col gap-1">
            <label class="input input-border flex max-w-none items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
                <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd"></path>
              </svg>
              <input type="password" v-model="password" class="grow" placeholder="password" />
            </label>
            <span class="text-base-content/60 flex items-center gap-2 px-1 text-[0.6875rem]"><span class="status status-error inline-block"></span> Password must be 8+ characters</span>
          </div>
          <label class="text-base-content/60 flex items-center gap-2 text-xs"> <input type="checkbox" v-model="acceptTerms" class="toggle toggle-xs" /> Accept terms without reading </label>
          <label class="text-base-content/60 flex items-center gap-2 text-xs"> <input type="checkbox" v-model="subscribeToSpam" class="toggle toggle-xs" /> Subscribe to spam emails </label>
          <div class="card-actions items-center gap-6">
            <button type="button" class="btn btn-primary">Register</button>
            <button type="button" class="link">Or login</button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "../store/userStore";

const userStore = useUserStore();
const email = ref("");
const password = ref("");
const acceptTerms = ref(false);
const subscribeToSpam = ref(false);

const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const dropdownRef = ref(null);

const menuItems = [
  { name: "Home", href: "#", active: true },
  { name: "About", href: "#", active: false },
  { name: "Services", href: "#", active: false },
  { name: "Pricing", href: "#", active: false },
  { name: "Contact", href: "#", active: false },
];

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
