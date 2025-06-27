import { defineStore } from "pinia";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore = defineStore("userStore", {
  state: () => ({
    loading: false,
    error: null,
    token: null,
    user: null,
    status: null,
  }),

  getters: {
    isAuthenticated: ({ user }) => !!user,
    displayName: ({ user }) => user?.username || user?.email || "Anonymous",
    isActive: ({ user }) => user?.status === "active",
    isAdmin: ({ user }) => user?.rule || false,
  },

  actions: {
    //

    async fetchUserData(endpoint, payload) {
      try {
        const { data } = await axios.post(API_URL + endpoint, JSON.stringify(payload), { headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" } });
        for (const element of Object.keys(data)) {
          this[element] = data[element];
          console.log(element, data[element]);
        }
      } catch (error) {
        this.error = error.message || "An unexpected error occurred";
      }
    },

    async createUser(payload) {
      await this.fetchUserData("/register", payload);
    },

    async signin(payload) {
      await this.fetchUserData("/login", payload);
    },

    async getUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const endpoint = API_URL + "/user";
        const { data } = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        for (const element of Object.keys(data)) {
          this[element] = data[element];
          console.log(element, data[element]);
        }
      } catch (error) {
        this.error = error.message || "An unexpected error occurred";
      }
    },

    async logoutUser() {
      localStorage.removeItem("token");
      this.token = null;
      location.reload();
    },
  },
});
