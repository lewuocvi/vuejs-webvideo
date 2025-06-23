<template>
    <main class="container mx-auto px-4 py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="post in sortedPosts" :key="post.id" class="bg-white rounded-lg shadow-md overflow-hidden">
                <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
                    <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover" />
                </router-link>
                <div class="p-4">
                    <h3 class="text-md font-semibold mb-2">
                        <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
                            {{ truncateTitle(post.title) }}
                        </router-link>
                    </h3>
                    <p class="text-gray-600 mb-2">
                        {{ post.postedBy?.name || 'Unknown Author' }}
                    </p>
                    <div class="text-sm text-gray-500">
                        <span>Views: {{ post.views || 0 }}</span>
                        <span class="mx-2">|</span>
                        <span>{{ formatDate(post.createdAt) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { usePostStore } from "../store/postStore";
import { useRouter } from "vue-router";

const postStore = usePostStore();
const router = useRouter();

onMounted(() => {
    postStore.fetchPosts();
});

const sortedPosts = computed(() => {
    return [...postStore.posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
});

const truncateTitle = (title, maxLength = 100) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
};
</script>