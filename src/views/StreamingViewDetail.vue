<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="streamingStore.streaming" class="bg-white overflow-hidden">
      <div class="p-6">
        <PlyrPlayer :source="generateLinkProxy(streamingStore.streaming.playlist)" />

        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ streamingStore.streaming.title }}</h1>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500"> Đăng ngày: {{ new Date(streamingStore.streaming.created_at).toLocaleDateString("vi-VN") }} </span>

          <router-link v-if="userStore.isAdmin" :to="editLink" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Chỉnh sửa
          </router-link>
        </div>
      </div>
    </div>

    <p v-else class="text-xl text-gray-600 text-center py-12">Đang tải dữ liệu...</p>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/userStore.js";
import { useStreamingStore } from "../store/streamingStore.js";
import PlyrPlayer from "../components/PlyrPlayer.vue";

const userStore = useUserStore();
const streamingStore = useStreamingStore();
const route = useRoute();

const editLink = computed(() => `/edit/${streamingStore.streaming?.id}`);

onMounted(() => {
  streamingStore.fetchPost(route.query.v);
});

const metaDescription = computed(() => {
  if (streamingStore.streaming) {
    // return streamingStore.streaming?.description.substring(0, 160) + "...";
  }
  return "Đang tải bài viết...";
});

const generateLinkProxy = (link) => streamingStore.getStreamingProxy + link;

function updateMetaTag(attr, value, key = "name") {
  let element = document.head.querySelector(`meta[${key}="${attr}"]`);
  if (element) {
    element.setAttribute("content", value);
  } else {
    element = document.createElement("meta");
    element.setAttribute(key, attr);
    element.setAttribute("content", value);
    document.head.appendChild(element);
  }
}

watch(
  () => streamingStore.streaming,
  (streaming) => {
    if (streaming) {
      // Cập nhật title
      document.title = streaming.title;

      // Cập nhật các thẻ meta
      updateMetaTag("description", metaDescription.value);
      updateMetaTag("og:title", streaming.name, "property");
      updateMetaTag("og:description", metaDescription.value, "property");
      updateMetaTag("og:image", streaming.thumbnail, "property");
      updateMetaTag("og:type", "article", "property");
      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:title", streaming.name);
      updateMetaTag("twitter:description", metaDescription.value);
      updateMetaTag("twitter:image", streaming.thumbnail);
    }
  },
  { immediate: true }
);

//
</script>
