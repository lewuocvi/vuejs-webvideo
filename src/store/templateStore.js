import { defineStore } from "pinia";

export const useTemplateStore = defineStore("template", {
  state: () => ({
    sidebarOpen: false,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    setSidebarOpen(value) {
      this.sidebarOpen = value;
    },
  },
});
