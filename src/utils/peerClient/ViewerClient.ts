import { Role } from "amazon-kinesis-video-streams-webrtc";
import { EventEmitter } from "events";
import { setupKinesis } from "./KinesisClient";

export const getViewClient = async (p: {
  receiverUuid: string;
  videoChatUuid: string;
  startWithVoice: boolean;
  onReadyToSendTrack: Function;
}) => {
  const eventEmitter = new EventEmitter();
  const kinesis = await setupKinesis({
    role: Role.VIEWER,
    channelUuid: p.videoChatUuid,
    clientUserId: p.receiverUuid,
  });

  if (!kinesis) {
    return false;
  }

  const { signalingClient, peerConfig } = kinesis;

  const peerConnection = new RTCPeerConnection(peerConfig);

  signalingClient.on("open", async () => {
    console.log("[VIEWER] Connected to signaling service");

    //await p.onReadyToSendTrack(peerConnection);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((streams) => {
        streams.getTracks().forEach((track) => {
          peerConnection.addTrack(track, streams);
        });
      });
    await peerConnection.setLocalDescription(
      await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
    );

    if (peerConnection.localDescription) {
      signalingClient.sendSdpOffer(peerConnection.localDescription);
    }
  });

  signalingClient.on("sdpAnswer", async (answer) => {
    await peerConnection.setRemoteDescription(answer);
  });

  signalingClient.on("iceCandidate", (candidate) => {
    peerConnection.addIceCandidate(candidate);
  });

  signalingClient.on("close", (ev) => {
    eventEmitter.emit("close", ev);
    console.log("[VIEWER] Disconnected from signaling channel");
  });

  signalingClient.on("error", (error) => {
    console.error("[VIEWER] Signaling client error: ", error);
    eventEmitter.emit("error", error);
  });

  peerConnection.addEventListener("icecandidate", ({ candidate }) => {
    if (candidate) {
      signalingClient.sendIceCandidate(candidate);
    }
  });

  peerConnection.addEventListener("track", (event) => {
    eventEmitter.emit("track", event.streams[0]);
  });

  console.log("[VIEWER] Starting viewer connection");
  signalingClient.open();

  return {
    onNewTrack: (fn: (t: RTCTrackEvent["streams"][0]) => void) => {
      eventEmitter.on("track", fn);
    },
    onError: (fn: (t: any) => void) => {
      eventEmitter.on("error", fn);
    },
    onClose: (fn: (t: any) => void) => {
      eventEmitter.on("close", fn);
    },
    onPeerCreated: (fn: (t: RTCPeerConnection) => void) => {
      eventEmitter.on("peer", fn);
    },
  };
};
