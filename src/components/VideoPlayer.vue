<template>
    <div class="max-w-3xl mx-auto pt-8">
        <video ref="videoEl" controls class="w-full rounded-xl shadow-lg"></video>
        <div class="mt-4 bg-gray-100 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">P2P Stats</h3>
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-white p-3 rounded shadow">
                    <p class="text-sm text-gray-600">Connected Peers</p>
                    <p class="text-2xl font-bold">{{ connectedPeers }}</p>
                </div>
                <div class="bg-white p-3 rounded shadow">
                    <p class="text-sm text-gray-600">Downloaded</p>
                    <p class="text-2xl font-bold">{{ formatBytes(totalDownloaded) }}</p>
                </div>
                <div class="bg-white p-3 rounded shadow">
                    <p class="text-sm text-gray-600">Uploaded</p>
                    <p class="text-2xl font-bold">{{ formatBytes(totalUploaded) }}</p>
                </div>
            </div>
        </div>
    </div>

    <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Xin chào {{ userStore.displayName }}</h3>
            <p class="py-4">Tài khoản của bạn hiện chưa đăng ký dịch vụ trả phí. <br> Độ phân giải video sẽ tự động
                chuyển sang chất lượng thấp hơn để phù hợp với gói dịch vụ hiện tại của bạn.</p>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn" @click="handleContinue">Tiếp tục</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '../store/userStore'
import Plyr from 'plyr'
import Hls from 'hls.js'
import { HlsJsP2PEngine } from 'p2p-media-loader-hlsjs'

import 'plyr/dist/plyr.css'

const userStore = useUserStore() // Use the userStore
const videoEl = ref(null)
let hls = null
let player = null
const lowQuality = ref(0)
const currentQuality = ref(0)

const viewerId = ref('')
const connectedPeers = ref(0)
const totalDownloaded = ref(0)
const totalUploaded = ref(0)

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleContinue = () => {
    player.play(); // Play the video
};

const checkViewingPermissions = () => {
    if (userStore.userPlanType !== "active") {
        player.quality = lowQuality.value
        document.getElementById('my_modal_1').showModal()
    }
}

onMounted(() => {
    const video = videoEl.value
    const source = 'https://streaming.emmcvietnam.com/static/streaming-playlists/hls/2c31b849-dc3b-4022-9002-86bc492e4d5e/e27714fe-cfa7-4ae0-be65-968b0c51c5f8-master.m3u8'

    viewerId.value = userStore.displayName

    if (Hls.isSupported()) {
        const HlsWithP2P = HlsJsP2PEngine.injectMixin(Hls)

        hls = new HlsWithP2P({
            p2p: {
                core: {
                    highDemandTimeWindow: 30, // 30 seconds
                    simultaneousHttpDownloads: 3,
                    webRtcMaxMessageSize: 64 * 1024, // 64 KB
                    p2pNotReceivingBytesTimeoutMs: 10000, // 10 seconds
                    p2pInactiveLoaderDestroyTimeoutMs: 15000, // 15 seconds
                    httpNotReceivingBytesTimeoutMs: 8000, // 8 seconds
                    httpErrorRetries: 2,
                    p2pErrorRetries: 2,
                    announceTrackers: ["wss://tracker.webtorrent.dev", "wss://tracker.openwebtorrent.com"],
                    rtcConfig: {
                        iceServers: [
                            { urls: "stun:stun.l.google.com:19302" },
                            { urls: "stun:stun.l.google.com:5349" },
                            { urls: "stun:stun1.l.google.com:3478" },
                            { urls: "stun:stun1.l.google.com:5349" },
                            { urls: "stun:stun2.l.google.com:19302" },
                            { urls: "stun:stun2.l.google.com:5349" },
                            { urls: "stun:stun3.l.google.com:3478" },
                            { urls: "stun:stun3.l.google.com:5349" },
                            { urls: "stun:stun4.l.google.com:19302" },
                            { urls: "stun:stun4.l.google.com:5349" }
                        ]
                    },
                    swarmId: '2c31b849-dc3b-4022-9002-86bc492e4d5e',

                },
                onHlsJsCreated: (hlsInstance) => {
                    hlsInstance.p2pEngine.addEventListener('onPeerConnect', (peer) => {
                        console.log('Peer connected:', peer)
                        connectedPeers.value++
                    })

                    hlsInstance.p2pEngine.addEventListener('onPeerClose', (peer) => {
                        console.log('PeerClose:', peer)
                        connectedPeers.value = Math.max(0, connectedPeers.value - 1)
                    })

                    hlsInstance.p2pEngine.addEventListener('onPeerError', (peer) => {
                        // console.log('onPeerError:', peer)
                    })

                    hlsInstance.p2pEngine.addEventListener('onSegmentLoaded', (details) => {
                        // console.log('Segment Loaded:', details);
                    });

                    hlsInstance.p2pEngine.addEventListener('onSegmentError', (errorDetails) => {
                        // console.error('Error loading segment:', errorDetails);
                    });

                    hlsInstance.p2pEngine.addEventListener('onChunkDownloaded', (bytesLength, downloadSource, peerId) => {
                        totalDownloaded.value += bytesLength
                    });

                    hlsInstance.p2pEngine.addEventListener('onChunkUploaded', (bytesLength, peerId) => {
                        totalUploaded.value += bytesLength
                    })
                }
            }
        })

        fetch(source).then(async (response) => {
            let text = await response.text();
            const m3u8Files = [...text.matchAll(/URI="([^"]+\.m3u8)"|^([^#\r\n]+\.m3u8)/gm)].map(match => match[1] || match[2]).filter(Boolean);

            for (const element of m3u8Files) {
                const url = 'https://streaming.emmcvietnam.com/static/streaming-playlists/hls/2c31b849-dc3b-4022-9002-86bc492e4d5e/'
                const getStreaming = await fetch(url + element)
                const streamingText = await getStreaming.text();
                const modifiedStreamingText = streamingText.replace(/(^(?!#)|(?<=#EXT-X-MAP:URI="))[^"#\r\n]+\.mp4/gm, match => url + match);
                const streamingBlobUrl = URL.createObjectURL(new Blob([modifiedStreamingText], { type: 'application/x-mpegURL' }))
                const regex = new RegExp(element, 'g');
                text = text.replace(regex, streamingBlobUrl);
            }

            // Tạo Blob từ text đã được cập nhật
            const updatedBlob = new Blob([text], { type: 'application/x-mpegURL' });
            const updatedBlobUrl = URL.createObjectURL(updatedBlob);

            // Sử dụng updatedBlobUrl để load source
            hls.loadSource(updatedBlobUrl);
            hls.attachMedia(video);
        })

        // hls.loadSource(source)
        // hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            // Get the lowest quality level
            const levels = hls.levels;
            lowQuality.value = levels[0].height;
            // Initialize player
            player = new Plyr(video, {
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
                        console.log('Quality changed to', newQuality);
                    },
                },
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen', 'viewer-id']
            })

            player.on('ready', () => {
                const viewerIdControl = `
                    <div class="plyr__controls__item plyr__control viewer-id-control">
                        <span>${viewerId.value}</span>
                    </div>
                `
                player.elements.controls.insertAdjacentHTML('beforeend', viewerIdControl)

                checkViewingPermissions()

                setInterval(() => {
                    if (currentQuality.value > lowQuality.value) {
                        checkViewingPermissions()
                    }
                }, 15000)
            })
        })
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source
    }
})

onUnmounted(() => {
    if (hls) {
        hls.destroy()
    }
    if (player) {
        player.destroy()
    }
})
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