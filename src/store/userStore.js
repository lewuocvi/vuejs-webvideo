import { defineStore } from 'pinia'
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../firebase'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        currentUser: null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.currentUser,
        displayName: (state) => state.currentUser?.displayName || state.currentUser?.email || "Anonymous",
        userPlanType: (state) => state.currentUser?.planType || 'free',
        isAdmin: (state) => state.currentUser?.email === "lewuocvi@gmail.com" ? true : false
    },

    actions: {

        async initializeAuthListener() {
            return new Promise((resolve) => {
                onAuthStateChanged(auth, (user) => {
                    this.currentUser = user                    
                    resolve(user)
                })
            })
        },

        async registerUser(email, password, displayName) {
            this.loading = true
            this.error = null
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(userCredential.user, { displayName })
                this.currentUser = userCredential.user
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async loginUser(email, password) {
            this.loading = true
            this.error = null
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password)
                this.currentUser = userCredential.user
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async logoutUser() {
            this.loading = true
            this.error = null
            try {
                await signOut(auth)
                this.currentUser = null
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        }
    }
})