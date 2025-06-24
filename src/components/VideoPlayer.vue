<template>
    <div class="video-player-container">
        <video ref="videoElement" class="video" controls></video>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref, onBeforeUnmount } from 'vue';
import Plyr from 'plyr';
import Hls from 'hls.js';
import { HlsJsP2PEngine } from "p2p-media-loader-hlsjs";
import 'plyr/dist/plyr.css';

const props = defineProps({
    src: {
        type: String,
        required: true
    }
});

const videoElement = ref(null);
const player = ref(null);
const hls = ref(null);

const initializePlayer = (streamUrl) => {
    if (!Hls.isSupported()) {
        console.error('HLS is not supported in this browser.');
        return;
    }

    const HlsWithP2P = HlsJsP2PEngine.injectMixin(Hls);

    hls.value = new HlsWithP2P({
        p2p: {
            core: {
                swarmId: "Optional custom swarm ID for stream",
                // Other P2P engine config parameters go here
            },
            onHlsJsCreated(hlsInstance) {
                // Subscribe to P2P engine and Hls.js events here
            },
        },
    });

    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.value.levels;

        const quality = {
            default: levels[levels.length - 1].height,
            options: levels.map((level) => level.height),
            forced: true,
            onChange: (newQuality) => {
                levels.forEach((level, levelIndex) => {
                    if (level.height === newQuality) {
                        hls.value.currentLevel = levelIndex;
                    }
                });
            },
        };

        player.value = new Plyr(videoElement.value, {
            quality,
            autoplay: true,
            muted: true,
        });
    });

    hls.value.attachMedia(videoElement.value);
    hls.value.loadSource(streamUrl);
};

onMounted(() => {
    initializePlayer(props.src);
});

onBeforeUnmount(() => {
    if (player.value) {
        player.value.destroy();
    }
    if (hls.value) {
        hls.value.destroy();
    }
});
</script>

<style scoped>
.video-player-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}
</style>