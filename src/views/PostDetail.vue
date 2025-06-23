<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="postStore.currentPost" class="bg-white overflow-hidden">
            <div class="p-6">
                <div class="text-gray-600 text-lg leading-relaxed mb-6" v-html="formattedContent"></div>
                <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ postStore.currentPost.title }}</h1>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">
                        Đăng ngày: {{ new Date(postStore.currentPost.createdAt).toLocaleDateString('vi-VN') }}
                    </span>
                    <router-link :to="`/edit/${postStore.currentPost.id}`"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Chỉnh sửa
                    </router-link>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-12">
            <p class="text-xl text-gray-600">Đang tải bài viết...</p>
        </div>

        <div v-if="postStore.currentPost" class="bg-white overflow-hidden mt-4">
            <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Bình luận</h2>
                <CommentForm @add-comment="addComment" />
                <CommentList :comments="postStore.currentPost?.comments" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '../store/postStore'
import { useHead } from '@vueuse/head'
import CommentForm from '../components/CommentForm.vue'
import CommentList from '../components/CommentList.vue'

const postStore = usePostStore()
const route = useRoute()

onMounted(() => {
    postStore.fetchPost(route.params.id)
})

const metaDescription = computed(() => {
    if (postStore.currentPost) {
        return postStore.currentPost.content.substring(0, 160) + '...'
    }
    return 'Đang tải bài viết...'
})

const formattedContent = computed(() => {
    if (!postStore.currentPost) return ''

    const youtubeRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g
    return postStore.currentPost.content.replace(youtubeRegex, (match, videoId) => {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    })
})

const postImage = computed(() => {
    return postStore.currentPost?.image || 'https://source.unsplash.com/400x200/?technology'
})

watch(() => postStore.currentPost, (newPost) => {
    if (newPost) {
        useHead({
            title: newPost.title,
            meta: [
                { name: 'description', content: metaDescription.value },
                { property: 'og:title', content: newPost.title },
                { property: 'og:description', content: metaDescription.value },
                { property: 'og:image', content: postImage.value },
                { property: 'og:type', content: 'article' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: newPost.title },
                { name: 'twitter:description', content: metaDescription.value },
                { name: 'twitter:image', content: postImage.value },
            ],
        })
    }
}, { immediate: true })

const addComment = (comment) => {
    if (!postStore.currentPost) return

    const newComment = {
        id: Date.now(),
        content: comment,
        author: 'Anonymous',
        createdAt: new Date().toISOString(),
        replies: []
    }

    if (!postStore.currentPost.comments) postStore.currentPost.comments = []

    if (Array.isArray(postStore.currentPost.comments)) {
        postStore.currentPost.comments.unshift(newComment)
    }
}

</script>