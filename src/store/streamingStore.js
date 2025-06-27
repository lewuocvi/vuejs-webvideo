import { defineStore } from "pinia";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useStreamingStore = defineStore("streamingStore", {
  state: () => ({
    streamings: [],
    streaming: null,
    proxies: ["https://hls-streaming.emmcvietnamdotcom.workers.dev/proxy"],
  }),

  getters: {
    getToken: () => localStorage.getItem("token"),
    getStreamingProxy: (state) => state.proxies[0],
  },

  actions: {
    //

    //
    async fetchPosts() {
      try {
        const { data } = await axios.get(`${API_URL}/streamings`, { headers: { Authorization: `Bearer ${this.getToken}` } });
        for (const element of Object.keys(data)) {
          this[element] = data[element];
          console.log(element, data[element]);
        }
      } catch (error) {
        log.error(error);
      }
    },

    async fetchPost(id) {
      try {
        const { data } = await axios.get(`${API_URL}/streaming?v=${id}`, { headers: { Authorization: `Bearer ${this.getToken}` } });
        for (const element of Object.keys(data)) {
          this[element] = data[element];
          console.log(element, data[element]);
        }
      } catch (error) {
        log.error(error);
      }
    },

    async createPost(payload) {
      try {
        const { data } = await axios.post(`${API_URL}/streaming`, JSON.stringify(payload), { headers: { Authorization: `Bearer ${this.getToken}`, "Content-Type": "application/json" } });
        for (const element of Object.keys(data)) {
          this[element] = data[element];
          console.log(element, data[element]);
        }
      } catch (error) {
        log.error(error);
      }
    },

    async updatePost(id, payload) {
      try {
        const { data } = await axios.put(`${API_URL}/streaming?v=${id}`, JSON.stringify(payload), { headers: { Authorization: `Bearer ${this.getToken}`, "Content-Type": "application/json" } });
        for (const element of Object.keys(data)) {
          this[element] = data[element];
          console.log(element, data[element]);
        }
      } catch (error) {
        log.error(error);
      }
    },

    async deletePost(id) {
      try {
        const { data } = await axios.delete(`${API_URL}/streaming?v=${id}`, { headers: { Authorization: `Bearer ${this.getToken}` } });
        for (const element of Object.keys(data)) {
          this[element] = data[element];
          console.log(element, data[element]);
        }
      } catch (error) {
        log.error(error);
      }
    },

    //
  },
});
