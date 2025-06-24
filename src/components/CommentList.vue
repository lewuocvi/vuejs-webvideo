<template>
    <div class="space-y-4">
        <div v-for="comment in postStore.comments" :key="comment.id">
            <div class="mt-2 text-sm text-gray-600">
                <span>{{ comment.author }}</span>
            </div>

            <p class="bg-gray-100 rounded-lg p-4">{{ comment.content }}</p>

            <div class="mt-2 flex items-center space-x-4 ml-2">
                <p>{{ formatDate(comment.createdAt) }}</p>
                <button @click="likeComment(comment)" class="text-sm text-blue-600 hover:underline">
                    {{ comment.likes }} Thích
                </button>
                <button @click="dislikeComment(comment)" class="text-sm text-red-600 hover:underline">
                    {{ comment.dislikes }} Báo cáo
                </button>
                <button @click="showReplyForm(comment.id)" class="text-sm text-gray-600 hover:underline">
                    Trả lời
                </button>
            </div>

            <div v-if="replyingTo === comment.id" class="mt-2">
                <textarea v-model="replyContent" class="w-full p-2 border rounded"
                    placeholder="Nhập câu trả lời của bạn"></textarea>
                <div class="mt-2">
                    <button @click="submitReply(comment)"
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Gửi</button>
                    <button @click="cancelReply"
                        class="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Hủy</button>
                </div>
            </div>

            <!-- Hiển thị các câu trả lời -->
            <div v-if="!comment.replyingTo">
                <ReplyList :commentId="comment.id" :comments="postStore.comments" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { usePostStore } from '../store/postStore'
import { useUserStore } from '../store/userStore.js'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRoute } from 'vue-router'
import ReplyList from '../components/ReplytList.vue'

const route = useRoute()
const postStore = usePostStore()
const userStore = useUserStore()

const replyingTo = ref(null)
const replyContent = ref('')

onMounted(() => {
    postStore.fetchComments(route.params.id)
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

const showReplyForm = (commentId) => {
    replyingTo.value = commentId
    replyContent.value = ''
}

const submitReply = async (comment) => {
    if (replyContent.value.trim()) {
        await postStore.addComment(route.params.id, { content: replyContent.value, replyingTo: comment.id })
    }
    cancelReply()
}

const cancelReply = () => {
    replyingTo.value = null
    replyContent.value = ''
}
</script>