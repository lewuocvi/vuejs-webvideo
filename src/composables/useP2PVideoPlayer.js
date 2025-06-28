import { ref, reactive } from "vue";
import Hls from "hls.js";
import { HlsJsP2PEngine } from "p2p-media-loader-hlsjs";

export function useP2PVideoPlayer(source) {
  const connectedPeers = ref(0);
  const totalDownloaded = ref(0);
  const totalUploaded = ref(0);

  const callbacks = reactive({
    onPeerConnect: null,
    onPeerClose: null,
    onPeerError: null,
    onSegmentLoaded: null,
    onSegmentError: null,
    onChunkDownloaded: null,
    onChunkUploaded: null,
  });

  const setCallback = (name, callback) => {
    callbacks[name] = callback;
  };

  const on = (event, callback) => setCallback(event, callback);

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
                callbacks.onPeerConnect?.(peer);
                connectedPeers.value++;
              },
              onPeerClose: (peer) => {
                callbacks.onPeerClose?.(peer);
                connectedPeers.value = Math.max(0, connectedPeers.value - 1);
              },
              onPeerError: (peer) => callbacks.onPeerError?.(peer),
              onSegmentLoaded: (details) => callbacks.onSegmentLoaded?.(details),
              onSegmentError: (errorDetails) => callbacks.onSegmentError?.(errorDetails),
              onChunkDownloaded: (bytesLength) => {
                totalDownloaded.value += bytesLength;
                callbacks.onChunkDownloaded?.(bytesLength);
              },
              onChunkUploaded: (bytesLength) => {
                totalUploaded.value += bytesLength;
                callbacks.onChunkUploaded?.(bytesLength);
              },
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

    return {
      hls,
      destroy: () => hls?.destroy(),
    };
  };

  return { connectedPeers, totalDownloaded, totalUploaded, initializeP2P, on };
}
