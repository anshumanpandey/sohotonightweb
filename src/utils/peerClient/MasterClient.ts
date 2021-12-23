import { Role } from "amazon-kinesis-video-streams-webrtc";
import { EventEmitter } from "events";
import { setupKinesis } from "./KinesisClient";

export const GetMasterClient = async (p: {
  receiverUuid: string;
  videoChatUuid: string;
  startWithVoice: boolean;
  onReadyToSendTrack: Function;
  onTrack: Function;
}) => {
  const eventEmitter = new EventEmitter();
  const kinesis = await setupKinesis({
    role: Role.MASTER,
    channelUuid: p.videoChatUuid,
    clientUserId: p.receiverUuid,
  });

  if (!kinesis) {
    return false;
  }
  const { signalingClient, peerConfig } = kinesis;

  signalingClient.on("open", async () => {
    console.log("[MASTER] Connected to signaling service");
  });

  let peerConnection: RTCPeerConnection | undefined = undefined;

  signalingClient.on("sdpOffer", async (offer, remoteClientId) => {
    peerConnection = new RTCPeerConnection(peerConfig);

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        signalingClient.sendIceCandidate(candidate, remoteClientId);
      }
    };

    peerConnection.ontrack = (event) => {
      console.log(
        "[MASTER] Received remote track from client: " + remoteClientId
      );
      eventEmitter.emit("track", event.streams[0]);
      p.onTrack(event.streams[0]);
    };

    eventEmitter.emit("peer", peerConnection);

    await p.onReadyToSendTrack(peerConnection);
    await peerConnection.setRemoteDescription(offer);

    await peerConnection.setLocalDescription(
      await peerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
    );

    if (peerConnection.localDescription) {
      signalingClient.sendSdpAnswer(
        peerConnection.localDescription,
        remoteClientId
      );
    }
  });

  signalingClient.on("iceCandidate", async (candidate) => {
    try {
      await peerConnection?.addIceCandidate(candidate);
    } catch (err) {
      console.log(err);
    }
  });

  signalingClient.on("close", (ev) => {
    console.log("[MASTER] Disconnected from signaling channel");
    eventEmitter.emit("close", ev);
  });

  signalingClient.on("error", (err) => {
    console.error("[MASTER] Signaling client error");
    eventEmitter.emit("error", err);
  });

  console.log("[MASTER] Starting master connection");
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
