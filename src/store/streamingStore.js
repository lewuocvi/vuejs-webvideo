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
    async getInfo(id) {
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
    //
  },
});
