<template>
    <div class="container mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">
            {{ isEdit ? 'Chỉnh sửa' : 'Tạo mới' }} bài viết
        </h2>
        <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
            <div class="mb-4">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <input v-model="form.title" id="title" type="text" placeholder="Nhập tiêu đề bài viết" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div class="mb-4">
                <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                <textarea v-model="form.content" id="content" placeholder="Nhập nội dung bài viết" required rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div class="flex justify-end">
                <button type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '../store/postStore'

const postStore = usePostStore()
const route = useRoute()
const router = useRouter()

const form = ref({ title: '', content: '' })
const isEdit = route.path.includes('edit')

onMounted(async () => {
    if (isEdit) {
        await postStore.fetchPost(route.params.id)
        form.value = { ...postStore.currentPost }
    }
})

const handleSubmit = async () => {
    if (isEdit) {
        await postStore.updatePost(route.params.id, form.value)
    } else {
        await postStore.createPost(form.value)
    }
    router.push('/')
}
</script>
