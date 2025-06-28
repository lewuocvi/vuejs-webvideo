<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white">
    <div class="flex justify-between items-center p-2">
      <div class="flex items-center gap-4">
        <button @click="toggleSidebar()" class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <router-link :to="{ name: 'Home' }" class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Blog của tôi</span>
        </router-link>
      </div>

      <div class="flex-1 justify-center items-center max-w-2xl mx-auto hidden sm:flex">
        <div class="w-full relative">
          <input type="text" placeholder="Tìm kiếm" class="w-full border border-gray-300 rounded-l-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <button type="button" class="btn absolute right-0 top-0 h-full px-4 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 rounded-r-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button @click="toggleSearch" class="p-2 hover:bg-gray-100 rounded-full sm:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        <router-link to="/login" class="btn bg-white text-black border-[#e5e5e5] flex items-center">
          <svg aria-label="Email icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="black">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </g>
          </svg>
          Đăng nhập
        </router-link>
      </div>
    </div>

    <div v-if="showMobileSearch" class="fixed inset-0 bg-white z-50">
      <div class="flex items-center p-2">
        <button @click="toggleSearch" class="p-2 mr-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <input type="text" placeholder="Tìm kiếm" class="flex-1 py-2 px-4 focus:outline-none" ref="searchInput" @focus="moveCursorToEnd" />
        <button class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import { useTemplateStore } from "../store/templateStore";
import { useRouter } from "vue-router";

const templateStore = useTemplateStore();

const showMobileSearch = ref(false);
const searchInput = ref(null);

const toggleSidebar = () => {
  templateStore.toggleSidebar();
};

const toggleSearch = () => {
  showMobileSearch.value = !showMobileSearch.value;
  if (showMobileSearch.value) {
    nextTick(() => {
      searchInput.value.focus();
    });
  }
};

const moveCursorToEnd = (event) => {
  event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
};

onMounted(() => {
  // document.body.style.paddingTop = "64px";
});

//
</script>
