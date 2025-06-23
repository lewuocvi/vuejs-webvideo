<template>
    <form @submit.prevent="submitComment" class="mb-6">
        <textarea v-model="commentContent" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            rows="4" placeholder="Viết bình luận của bạn..." required></textarea>
        <button type="submit"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline">
            Gửi bình luận
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue'

const commentContent = ref('')
const emit = defineEmits(['add-comment'])

const submitComment = () => {
    if (commentContent.value.trim()) {
        emit('add-comment', commentContent.value)
        commentContent.value = ''
    }
}
</script>