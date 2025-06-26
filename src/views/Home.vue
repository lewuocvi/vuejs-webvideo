<template>
  <main class="container mx-auto px-4 py-10">
    <div v-if="sortedPosts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <article v-for="post in sortedPosts" :key="post.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
          <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover" />
        </router-link>
        <div class="p-4">
          <h3 class="text-md font-semibold mb-2">
            <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
              {{ truncateTitle(post.title) }}
            </router-link>
          </h3>
          <p class="text-gray-600 mb-2">{{ post.postedBy?.name || "Unknown Author" }}</p>
          <div class="text-sm text-gray-500 flex justify-between">
            <span>Views: {{ post.views || 0 }}</span>
            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
      </article>
    </div>
    <p v-else class="text-xl text-gray-600 text-center py-12">Đang tải dữ liệu...</p>
  </main>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { usePostStore } from "../store/postStore";
import { storeToRefs } from "pinia";

const postStore = usePostStore();
const { posts } = storeToRefs(postStore);

onMounted(postStore.fetchPosts);

const sortedPosts = computed(() => [...posts.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

const truncateTitle = (title, maxLength = 100) => (title.length > maxLength ? `${title.slice(0, maxLength)}...` : title);

const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" }) : "Unknown date");
</script>
