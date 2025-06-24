import { defineStore } from 'pinia'
import axios from 'axios'
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL

const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return {
            headers: { 'Authorization': `Bearer ${token}` }
        };
    }
    return {};
}

export const usePostStore = defineStore('postStore', {
    state: () => ({
        posts: [],
        comments: [],
        currentPost: null
    }),

    actions: {
        async fetchPosts() {
            try {
                const headers = await getAuthHeaders();
                const { data } = await axios.get(`${API_URL}/posts`, headers)
                this.posts = data
            } catch (error) {
                console.error('Error fetching posts:', error)
                this.posts = []
            }
        },

        async fetchPost(id) {
            try {
                const headers = await getAuthHeaders();
                const { data } = await axios.get(`${API_URL}/posts?id=${id}`, headers)
                this.currentPost = data
            } catch (error) {
                console.error('Error fetching post:', error)
                this.currentPost = null
            }
        },

        async createPost(post) {
            try {
                const headers = await getAuthHeaders();
                await axios.post(`${API_URL}/posts`, post, headers)
                await this.fetchPosts()
            } catch (error) {
                console.error('Error creating post:', error)
            }
        },

        async updatePost(id, updatedPost) {
            try {
                const headers = await getAuthHeaders();
                await axios.put(`${API_URL}/posts/${id}`, updatedPost, headers)
                await this.fetchPosts()
            } catch (error) {
                console.error('Error updating post:', error)
            }
        },

        async deletePost(id) {
            try {
                const headers = await getAuthHeaders();
                await axios.delete(`${API_URL}/posts/${id}`, headers)
                await this.fetchPosts()
            } catch (error) {
                console.error('Error deleting post:', error)
            }
        },

        async fetchComments(postId) {
            try {
                const headers = await getAuthHeaders();
                const { data } = await axios.get(`${API_URL}/posts/${postId}/comments`, headers)
                this.comments = data
            } catch (error) {
                console.error('Error fetching comments:', error)
                this.comments = []
            }
        },

        async addComment(postId, payload) {
            try {
                const headers = await getAuthHeaders();
                const { data } = await axios.post(`${API_URL}/posts/${postId}/comments`, payload, headers)
                this.comments.unshift(data)
            } catch (error) {
                console.error('Error adding comment:', error)
            }
        }
    }
})