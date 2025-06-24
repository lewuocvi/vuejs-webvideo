<template>
  <div class="flex flex-col min-h-screen">
    <header class="navbar bg-base-100 shadow-sm">

      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <div class="navbar-start ml-6">
        <router-link :to="{ name: 'Home' }" class="text-2xl font-bold text-blue-600">Blog của tôi</router-link>
      </div>

      <div class="navbar-center w-2xl">
        <form @submit.prevent="handleSearch" class="mr-4 w-full">
          <label class="input w-full flex items-center">
            <svg class="h-[1em] opacity-50 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input v-model="searchQuery" type="search" placeholder="Tìm kiếm..." @keyup.enter="handleSearch"
              class="w-full outline-none bg-transparent" />
          </label>
        </form>
      </div>

      <div class="navbar-end mr-6">
        <nav class="flex gap-2">
          <router-link :to="{ name: 'PostForm' }" class="btn btn-dash btn-accent">Tạo bài viết</router-link>
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component"
                  src="https://s120-ava-talk.zadn.vn/e/3/c/f/32/120/6bff116d595d84ae55a484a5fa4c8901.jpg" />
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a class="justify-between"> Profile
                  <span class="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li v-if="!user"><router-link :to="{ name: 'Register' }">Đăng ký</router-link></li>
              <li v-if="!user"><router-link :to="{ name: 'Login' }">Đăng nhập</router-link></li>
              <li v-if="user"><a @click="handleLogout">Đăng xuất</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

    <main class="flex-grow">
      <router-view />
    </main>

    <footer class="bg-white shadow mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-gray-500">
        © {{ new Date().getFullYear() }} Blog của tôi. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './store/userStore'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const user = ref(null)

onMounted(async () => {
  await userStore.initializeAuthListener()
  user.value = userStore.currentUser
})

const handleLogout = async () => {
  await userStore.logoutUser()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
    searchQuery.value = ''
  }
}

</script>