<template>
  <main class="container mx-auto px-4 py-10">
    <div v-if="streamings.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <article v-for="streaming in streamings" :key="streaming.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <router-link :to="{ name: 'StreamingViewDetail', query: { v: streaming.uuid } }">
          <img :src="generateLinkProxy(streaming.thumbnail)" :alt="streaming.name" class="w-full h-48 object-cover" />
        </router-link>
        <div class="p-4">
          <h3 class="text-md font-semibold mb-2">
            <router-link :to="{ name: 'StreamingViewDetail', query: { v: streaming.uuid } }">
              {{ truncateTitle(streaming.name) }}
            </router-link>
          </h3>
          <p class="text-gray-600 mb-2">{{ streaming.postedBy?.name || "Unknown Author" }}</p>
          <div class="text-sm text-gray-500 flex justify-between">
            <span>Views: {{ streaming.views || 0 }}</span>
            <span>{{ formatDate(streaming.updated_at) }}</span>
          </div>
        </div>
      </article>
    </div>
    <p v-else class="text-xl text-gray-600 text-center py-12">Đang tải dữ liệu...</p>
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import { useStreamingStore } from "../store/streamingStore";
import { storeToRefs } from "pinia";

const streamingStore = useStreamingStore();
const { streamings } = storeToRefs(streamingStore);

onMounted(streamingStore.fetchPosts);

const generateLinkProxy = (link) => streamingStore.getStreamingProxy + link;

const truncateTitle = (title, maxLength = 100) => (title.length > maxLength ? `${title.slice(0, maxLength)}...` : title);

const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" }) : "Unknown date");

//
</script>
