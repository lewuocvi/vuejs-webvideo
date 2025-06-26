import { ref } from "vue";
import Hls from "hls.js";
import { HlsJsP2PEngine } from "p2p-media-loader-hlsjs";

export function useP2PVideoPlayer(source) {
  const connectedPeers = ref(0);
  const totalDownloaded = ref(0);
  const totalUploaded = ref(0);

  const initializeP2P = (video) => {
    let hls = null;

    if (Hls.isSupported()) {
      const HlsWithP2P = HlsJsP2PEngine.injectMixin(Hls);

      hls = new HlsWithP2P({
        p2p: {
          core: {
            announceTrackers: ["wss://tracker.webtorrent.dev", "wss://tracker.openwebtorrent.com"],
            rtcConfig: {
              iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun.l.google.com:5349" }],
            },
            swarmId: btoa(source).slice(-30),
          },
          onHlsJsCreated: (hlsInstance) => {
            const events = {
              onPeerConnect: (peer) => {
                console.log("Peer connected:", peer);
                connectedPeers.value++;
              },
              onPeerClose: (peer) => {
                console.log("PeerClose:", peer);
                connectedPeers.value = Math.max(0, connectedPeers.value - 1);
              },
              onPeerError: (peer) => console.log("onPeerError:", peer),
              onSegmentLoaded: (details) => console.log("Segment Loaded:", details),
              onSegmentError: (errorDetails) => console.error("Error loading segment:", errorDetails),
              onChunkDownloaded: (bytesLength) => (totalDownloaded.value += bytesLength),
              onChunkUploaded: (bytesLength) => (totalUploaded.value += bytesLength),
            };

            Object.entries(events).forEach(([event, handler]) => {
              hlsInstance.p2pEngine.addEventListener(event, handler);
            });
          },
        },
      });

      hls.loadSource(source);
      hls.attachMedia(video);
    }

    return { hls, destroy: () => hls?.destroy() };
  };

  return { connectedPeers, totalDownloaded, totalUploaded, initializeP2P };
}
