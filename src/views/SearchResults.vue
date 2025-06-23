<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Kết quả tìm kiếm cho "{{ searchQuery }}"</h1>

        <div v-if="loading" class="text-center">
            <p class="text-xl">Đang tải...</p>
        </div>

        <div v-else-if="searchResults.length === 0" class="text-center">
            <p class="text-xl">Không tìm thấy kết quả nào cho "{{ searchQuery }}"</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in searchResults" :key="post.id" class="bg-white rounded-lg shadow-md overflow-hidden">
                <img :src="post.image || 'https://source.unsplash.com/400x200/?blog'" :alt="post.title"
                    class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
                    <p class="text-gray-600 mb-4">{{ post.content.substring(0, 100) }}...</p>
                    <router-link :to="{ name: 'PostDetail', params: { id: post.id } }"
                        class="text-blue-600 hover:underline">
                        Đọc tiếp →
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '../store/postStore'

const route = useRoute()
const postStore = usePostStore()

const searchQuery = ref('')
const loading = ref(true)

const searchResults = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return postStore.posts.filter(post => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query))
})

const performSearch = async () => {
    loading.value = true
    searchQuery.value = route.query.q || ''

    if (!postStore.posts.length) {
        await postStore.fetchPosts()
    }

    loading.value = false
}

onMounted(performSearch)

watch(() => route.query.q, performSearch)

</script>