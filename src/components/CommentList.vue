<template>
    <div class="space-y-4">
        <div v-for="comment in comments" :key="comment.id" class="bg-gray-100 p-4 rounded-lg">
            <div class="mt-2 text-sm text-gray-600">
                <span>{{ comment.author }} - {{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-gray-800">{{ comment.content }}</p>
            
            <div class="mt-2 flex items-center space-x-4">
                <button @click="likeComment(comment)" class="text-sm text-blue-600 hover:underline">
                    {{ comment.likes }} Thích
                </button>
                <button @click="dislikeComment(comment)" class="text-sm text-red-600 hover:underline">
                    {{ comment.dislikes }} Không thích
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
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
    comments: {
        type: Array,
        required: true
    }
})

const replyingTo = ref(null)
const replyContent = ref('')

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const likeComment = (comment) => {
    comment.likes++
}

const dislikeComment = (comment) => {
    comment.dislikes++
}

const showReplyForm = (commentId) => {
    replyingTo.value = commentId
    replyContent.value = ''
}

const submitReply = (comment) => {
    if (replyContent.value.trim()) {
        const newReply = {
            id: Date.now(),
            content: replyContent.value,
            author: 'Current User',
            createdAt: new Date().toISOString(),
        }
        if (!comment.replies) {
            comment.replies = []
        }
        comment.replies.push(newReply)
        cancelReply()
    }
}

const cancelReply = () => {
    replyingTo.value = null
    replyContent.value = ''
}

</script>