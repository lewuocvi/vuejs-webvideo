<template>
  <div class="max-w-6xl mx-auto pt-8 flex flex-col md:flex-row gap-8">
    <div class="md:w-2/3 m-auto">
      <video ref="videoEl" controls class="w-full rounded-xl shadow-lg"></video>
    </div>
    <div v-if="debug" class="md:w-1/3">
      <div class="card bg-base-100 card-border border-base-300">
        <div class="flex items-center justify-between m-4 mb-0">
          <span class="flex items-center gap-2 font-semibold">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM9 12h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm5.697 2.395v-.733l1.269-1.219v2.984l-1.268-1.032Z" />
            </svg>
            Video Information
          </span>
          <button @click="debug = false" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </div>
        <ul class="menu w-full">
          <li>
            <span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z" clip-rule="evenodd" />
              </svg>
              Current Quality <span class="badge justify-self-end">{{ currentQuality }}p</span>
            </span>
          </li>
          <li>
            <span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z" />
              </svg>
              Lowest Quality <span class="badge justify-self-end">{{ lowQuality }}p</span>
            </span>
          </li>
          <li>
            <span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clip-rule="evenodd" />
              </svg>
              Connected Peers <span class="badge justify-self-end">{{ connectedPeers }}</span>
            </span>
          </li>
          <li>
            <span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd" />
              </svg>
              Downloaded <span class="badge justify-self-end">{{ formattedDownloaded }}</span>
            </span>
          </li>
          <li>
            <span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd" />
              </svg>
              Uploaded <span class="badge justify-self-end">{{ formattedUploaded }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Xin chào {{ userStore.displayName }}</h3>
      <p class="py-4">
        Tài khoản của bạn hiện chưa đăng ký dịch vụ trả phí. <br />
        Độ phân giải video sẽ tự động chuyển sang chất lượng thấp hơn để phù hợp với gói dịch vụ hiện tại của bạn.
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn" @click="handleContinue">Tiếp tục</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watchEffect } from "vue";
import { useUserStore } from "../store/userStore";
import { useP2PVideoPlayer } from "../composables/useP2PVideoPlayer";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});

const userStore = useUserStore();
const videoEl = ref(null);
const { connectedPeers, totalDownloaded, totalUploaded, initializeP2P } = useP2PVideoPlayer(props.source);

const debug = ref(true);
const player = ref(null);
const currentQuality = ref(0);
const lowQuality = ref(0);

const formattedDownloaded = computed(() => formatBytes(totalDownloaded.value));
const formattedUploaded = computed(() => formatBytes(totalUploaded.value));

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleContinue = () => {
  player.value?.play();
};

const checkViewingPermissions = () => {
  if (userStore.status !== "active") {
    player.value.quality = lowQuality.value;
    player.value.pause();
    document.getElementById("my_modal_1").showModal();
  }
};

watchEffect(() => {
  if (currentQuality.value > lowQuality.value) {
    checkViewingPermissions();
  }
});

onMounted(() => {
  const video = videoEl.value;
  if (!video) return;

  const { hls, destroy } = initializeP2P(video);

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
        },
      },
      controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen", "viewer-id"],
    });

    player.value.on("ready", () => {
      const viewerIdControl = `
                <div class="plyr__controls__item plyr__control viewer-id-control">
                    <span>${userStore.displayName}</span>
                </div>
            `;
      player.value.elements.controls.insertAdjacentHTML("beforeend", viewerIdControl);

      checkViewingPermissions();
    });
  });

  onUnmounted(() => {
    destroy();
    player.value?.destroy();
  });
});
</script>

<style>
.viewer-id-control {
  position: absolute;
  top: 0px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  pointer-events: none;
}
</style>
