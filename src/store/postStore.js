import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/posts'

export const usePostStore = defineStore('postStore', {
    state: () => ({
        posts: [],
        currentPost: null
    }),

    actions: {
        async fetchPosts() {
            const res = await axios.get(API_URL)
            this.posts = res.data
        },

        async fetchPost(id) {
            const res = await axios.get(`${API_URL}/${id}`)
            this.currentPost = res.data
        },

        async createPost(post) {
            await axios.post(API_URL, post)
            await this.fetchPosts()
        },

        async updatePost(id, updatedPost) {
            await axios.put(`${API_URL}/${id}`, updatedPost)
            await this.fetchPosts()
        },

        async deletePost(id) {
            await axios.delete(`${API_URL}/${id}`)
            await this.fetchPosts()
        },

        // async addComment(postId, comment) {
        //     if (!this.currentPost.comments) {
        //         this.currentPost.comments = []
        //     }
        //     this.currentPost.comments.unshift(comment)
        // }
    }
})
