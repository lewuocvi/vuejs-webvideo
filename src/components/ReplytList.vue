<template>
    <div class="space-y-4 ml-10">
        <div v-for="reply in filteredReplies" :key="reply.id">
            <div class="mt-2 text-sm text-gray-600">
                <span>{{ reply.author }}</span>
            </div>

            <p class="bg-gray-100 rounded-lg p-4">{{ reply.content }}</p>

            <div class="mt-2 flex items-center space-x-4 ml-2">
                <p>{{ formatDate(reply.createdAt) }}</p>
                <button @click="likeComment(reply)" class="text-sm text-blue-600 hover:underline">
                    {{ reply.likes }} Thích
                </button>
                <button @click="dislikeComment(reply)" class="text-sm text-red-600 hover:underline">
                    {{ reply.dislikes }} Báo cáo
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'
import { usePostStore } from '../store/postStore'
import { useUserStore } from '../store/userStore.js'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRoute } from 'vue-router'

const props = defineProps({
    commentId: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: true
    }
})

const route = useRoute()
const postStore = usePostStore()
const userStore = useUserStore()

const filteredReplies = computed(() => {
    return props.comments.filter(comment => comment.replyingTo === props.commentId)
})

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: vi })
}

const likeComment = async (comment) => {
    await postStore.likeComment(route.params.id, comment.id)
}

const dislikeComment = async (comment) => {
    await postStore.dislikeComment(route.params.id, comment.id)
}

</script>