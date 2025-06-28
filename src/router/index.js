import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import PostDetail from "../views/PostDetail.vue";
import PostForm from "../views/PostForm.vue";
import SearchResults from "../views/SearchResults.vue";

const routes = [
  { path: "/", name: "Home", component: () => import("../views/PlayerEmbed.vue") },
  { path: "/streaming", name: "StreamingViewDetail", component: () => import("../views/StreamingViewDetail.vue") },
  { path: "/posts/:id", name: "PostDetail", component: PostDetail },
  { path: "/create", name: "PostForm", component: PostForm },
  { path: "/edit/:id", name: "EditPost", component: PostForm },
  { path: "/search", name: "SearchResults", component: SearchResults },
  { path: "/login", name: "Login", component: () => import("../views/Login.vue") },
  { path: "/register", name: "Register", component: () => import("../views/Register.vue") },
  { path: "/player", name: "Player", component: () => import("../views/PlayerEmbed.vue"), meta: { layout: "none" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
