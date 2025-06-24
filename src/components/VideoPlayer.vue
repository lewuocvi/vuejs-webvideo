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
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import Hls from 'hls.js'
import { HlsJsP2PEngine } from 'p2p-media-loader-hlsjs'

const videoEl = ref(null)
let hls = null
let player = null

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

onMounted(() => {
    const video = videoEl.value
    const source = 'https://streaming.emmcvietnam.com/static/streaming-playlists/hls/2c31b849-dc3b-4022-9002-86bc492e4d5e/e27714fe-cfa7-4ae0-be65-968b0c51c5f8-master.m3u8'

    if (Hls.isSupported()) {
        const HlsWithP2P = HlsJsP2PEngine.injectMixin(Hls)

        hls = new HlsWithP2P({
            p2p: {
                core: {
                    swarmId: '2c31b849-dc3b-4022-9002-86bc492e4d5e',
                    trackers: [
                        'wss://tracker.webtorrent.dev'
                    ]
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
                        console.log('onPeerError:', peer)
                    })

                    hlsInstance.p2pEngine.addEventListener('onSegmentLoaded', (details) => {
                        console.log('Segment Loaded:', details);
                    });

                    hlsInstance.p2pEngine.addEventListener('onSegmentError', (errorDetails) => {
                        console.error('Error loading segment:', errorDetails);
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

        hls.loadSource(source)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            const availableQualities = hls.levels.map((l) => l.height)

            // Initialize player
            player = new Plyr(video, {
                quality: {
                    default: availableQualities[0],
                    options: availableQualities,
                    forced: true,
                    onChange: (newQuality) => updateQuality(newQuality)
                }
            })
        })

        function updateQuality(newQuality) {
            hls.levels.forEach((level, levelIndex) => {
                if (level.height === newQuality) {
                    hls.currentLevel = levelIndex
                }
            })
        }
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source
    }

    // player = new Plyr(video)
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