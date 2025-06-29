<template>
  <div v-if="loading" class="bg-black h-screen w-screen flex items-center justify-center">
    <span class="loading loading-spinner loading-xl"></span>
  </div>

  <div v-if="error" class="bg-black h-screen w-screen flex items-center justify-center">
    <div role="alert" class="alert alert-error max-w-md w-full mx-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>
  </div>
  <video v-else ref="videoEl" controls class="bg-black h-screen w-screen flex items-center justify-center"></video>

  //
</template>

<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useP2PVideoPlayer } from "../composables/useP2PVideoPlayer";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

// Constants
const API_URL = import.meta.env.VITE_API_URL;
const PROXIES_URL = ["https://hls-streaming-proxy.streaming001.workers.dev/proxy", "https://hls-streaming-proxy.proxy02.workers.dev/proxy", "https://hls-streaming.emmcvietnamdotcom.workers.dev/proxy"];
const PROXY_URL = PROXIES_URL[Math.floor(Math.random() * PROXIES_URL.length)];

// Composables
const route = useRoute();
const loading = ref(true);

// Refs
const videoEl = ref(null);
const error = ref(null);
const player = ref(null);
const source = ref(null);
const uuid = ref(route.query.uuid);
const randomId = ref(null);
const email = ref(null);
const currentQuality = ref(0);
const lowQuality = ref(0);
const subscribed = ref([]);

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const generateRandomId = (length = 32) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
};

const sendMessageToParent = (message) => {
  if (window.parent !== window) {
    window.parent.postMessage(message, "*");
  }
};

const setupPlayerEvents = () => {
  player.value.on("ready", () => {
    const viewerIdControl = `
      <div class="plyr__controls__item plyr__control viewer-id-control">
        <span>${email.value || "......"}</span>
      </div>
    `;
    player.value.elements.controls.insertAdjacentHTML("beforeend", viewerIdControl);
  });

  player.value.on("play", () => sendMessageToParent({ type: "play" }));
  player.value.on("pause", () => sendMessageToParent({ type: "pause" }));
  player.value.on("timeupdate", () => sendMessageToParent({ type: "timeUpdate", currentTime: player.value.currentTime }));
};

const messageHandler = (event) => {
  if (event.data.type === "control" && player.value) {
    switch (event.data.command) {
      case "play":
        player.value.play();
        break;
      case "pause":
        player.value.pause();
        break;
      case "seekTo":
        if (event.data.time !== undefined) {
          player.value.currentTime = event.data.time;
        }
        break;
      case "setQuality":
        if (event.data.quality !== undefined) {
          player.value.quality = event.data.quality;
        }
        break;
    }
  }
};

const showWarningDialog = () => {
  return new Promise((resolve) => {
    const dialog = document.createElement("div");
    dialog.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h3 class="text-lg font-bold mb-4">Thông báo về Đăng ký</h3>
          <p class="mb-4">Đăng ký của bạn đã hết hạn. Chất lượng video đã được giảm để phù hợp với gói hiện tại của bạn.</p>
          <button id="continueBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Tiếp tục xem chất lượng thấp
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    const continueBtn = dialog.querySelector("#continueBtn");
    continueBtn.addEventListener("click", () => {
      document.body.removeChild(dialog);
      resolve(true);
    });
  });
};

const initializePlayer = (hls, video) => {
  hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
    const levels = hls.levels;
    lowQuality.value = levels[0].height;

    player.value = new Plyr(video, {
      quality: {
        default: levels[levels.length - 1].height,
        options: levels.map((level) => level.height),
        forced: true,
        onChange: (newQuality) => {
          levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hls.currentLevel = levelIndex;
              currentQuality.value = level.height;
            }
          });
          console.log("Quality changed to", newQuality);
          sendMessageToParent({ type: "qualityChange", quality: newQuality });
        },
      },
      controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen", "viewer-id"],
    });

    setupPlayerEvents();
  });
};

const decodeQueryData = async () => {
  if (route.query.data) {
    try {
      const decodedData = atob(route.query.data);
      const data = JSON.parse(decodedData);
      email.value = data.email;
      const response = await fetch(`${API_URL}/subscription/?email=${email.value}`);
      const { results } = await response.json();
      subscribed.value = results.map(({ end_date, status }) => ({ end_date: new Date(end_date), status }));
    } catch (err) {
      error.value = "Error decoding or parsing data";
    }
  }
};

const initializeHLS = async (m3u8) => {
  if (!m3u8) return;

  await decodeQueryData();

  if (!email.value) {
    error.value = "You don't have permission to view this content";
    return;
  }

  randomId.value = generateRandomId();

  const video = videoEl.value;
  if (!video) return;

  const { initializeP2P, destroy } = useP2PVideoPlayer(m3u8);
  const { hls } = initializeP2P(video);

  initializePlayer(hls, video);

  window.addEventListener("message", messageHandler);
};

const fetchStreamingData = async () => {
  loading.value = true;
  try {
    if (!uuid.value) {
      error.value = "Missing video UUID";
      return;
    }
    //
    const response = await fetch(`${API_URL}/streaming?v=${uuid.value}`);
    const { streaming } = await response.json();
    source.value = PROXY_URL + streaming.playlist;
    //
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStreamingData);

watchEffect(() => {
  initializeHLS(source.value);
});

watchEffect(async () => {
  if (currentQuality.value > lowQuality.value) {
    const subscribedFilter = subscribed.value.filter(({ end_date, status }) => status === "active" && end_date.getTime() > Date.now());
    if (subscribedFilter.length === 0) {
      player.value.quality = lowQuality.value;
      player.value.pause();
      console.log("Subscription expired. Lowering quality to", lowQuality.value);
      // Show warning dialog
      const confirmed = await showWarningDialog();
      if (confirmed) {
        player.value.play();
      }
    }
  }
});

//
</script>
