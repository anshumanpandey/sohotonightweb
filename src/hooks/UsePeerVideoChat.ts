import { useEffect, useState } from "react";
import { UseCallTracker } from "./UseCallTracker";
import { startSocketConnection } from "../request/socketClient";
import { hideVideoModal, useGlobalState } from "../state/GlobalState";
import { createGlobalState } from "react-hooks-global-state";
import { Role } from "amazon-kinesis-video-streams-webrtc";
import { logActionToServer } from "../utils/logaction";
import { BrandColor } from "../utils/Colors";
import Color from "color";
import { UseMediaStreamManager } from "./UseMediaStreamManager";
import { UseNotificationManager } from "./UseNotificationManager";
import { GetMasterClient } from "../utils/peerClient/MasterClient";
import { getViewClient } from "../utils/peerClient/ViewerClient";

const StreamStore = new Map<"AUDIO" | "VIDEO", MediaStreamTrack>();
const StreamPool = {
  addTrack: (forType: "AUDIO" | "VIDEO", track: MediaStreamTrack) => {
    StreamStore.set(forType, track);
  },
  removeTrack: (forType: "AUDIO" | "VIDEO") => {
    StreamStore.delete(forType);
  },
  getGeneratedStream: () => {
    const allTracks = Array.from(StreamStore.values());
    return new MediaStream(allTracks);
  },
};

const suggestionDivId = "suggestiondivid";
const buildPlayerSuggestion = () => {
  const newContent = document.createTextNode(`X`);
  const closeMark = document.createElement("span");
  closeMark.setAttribute("aria-hidden", "true");
  closeMark.appendChild(newContent);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "close";
  closeBtn.style.marginTop = "0";
  closeBtn.setAttribute("data-dismiss", "alert");
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.appendChild(closeMark);

  const suggestionDiv = document.createElement("div");
  suggestionDiv.id = suggestionDivId;
  suggestionDiv.className = "alert alert-warning alert-dismissible";
  suggestionDiv.setAttribute("role", "alert");
  suggestionDiv.appendChild(closeBtn);
  suggestionDiv.style.backgroundColor = Color(BrandColor)
    .lighten(0.1)
    .toString();
  suggestionDiv.style.borderColor = Color(BrandColor).lighten(0.4).toString();
  suggestionDiv.style.color = "white";
  suggestionDiv.style.zIndex = "5";
  suggestionDiv.style.position = "relative";

  const points = ["If video does not start click on play button"];
  const uList = document.createElement("ul");
  points.forEach((point) => {
    const el = document.createElement("li");
    el.style.textAlign = "center";
    const txt = document.createTextNode(point);
    el.appendChild(txt);
    uList.appendChild(el);
  });

  suggestionDiv.appendChild(uList);

  return suggestionDiv;
};

const videoModalTextId = "video-modal-text";
const buildDefaultPlayerMessage = (
  text: string = "Wait for a invitation and start a video chat",
  removePlayer: boolean = false
) => {
  const newDiv = document.createElement("h2");
  newDiv.id = videoModalTextId;
  const newContent = document.createTextNode(text);
  newDiv.style.textAlign = "center";
  newDiv.style.paddingLeft = "0";

  newDiv.appendChild(newContent); //añade texto al div creado.

  if (removePlayer === true) {
    document.getElementById("my-video")?.remove();
  }

  return newDiv;
};

const videoPreviewId = "my-video-preview";
const createPreviewPlayer = () => {
  const previewVideoPlayer = document.createElement("video");
  previewVideoPlayer.id = videoPreviewId;
  previewVideoPlayer.controls = false;
  previewVideoPlayer.autoplay = true;
  previewVideoPlayer.style.width = "30%";
  previewVideoPlayer.style.height = "30%";
  previewVideoPlayer.style.position = "absolute";
  previewVideoPlayer.style.right = "0";
  previewVideoPlayer.style.top = "0";
  previewVideoPlayer.style.marginTop = "3rem";
  previewVideoPlayer.style.marginRight = "2rem";
  previewVideoPlayer.style.zIndex = "10";
  return previewVideoPlayer;
};

const getCurrentVideoPreview = () => {
  return document.getElementById(videoPreviewId);
};

const setPreviewPosition = ({
  horizontalMargin,
}: {
  horizontalMargin: number;
}) => {
  const currentPreview = getCurrentVideoPreview();
  if (currentPreview) {
    currentPreview.style.marginLeft = horizontalMargin + "px";
  }
};

const attachVideoPlayer = ({ parentNode }: { parentNode: HTMLElement }) => {
  const mainVideoPlayer = document.createElement("video");
  const videoMainId = "my-video";
  mainVideoPlayer.id = videoMainId;
  mainVideoPlayer.controls = true;
  mainVideoPlayer.autoplay = true;
  mainVideoPlayer.style.width = "100%";

  return {
    addRemoteStream: (s: MediaStream) => {
      const text = document.createTextNode(
        "Your browser does not support HTML5 video."
      );
      mainVideoPlayer.appendChild(text);
      const suggestionNode = buildPlayerSuggestion();

      document.getElementById(videoMainId)?.remove();
      document.getElementById(videoModalTextId)?.remove();
      document.getElementById(suggestionDivId)?.remove();

      parentNode.appendChild(mainVideoPlayer);
      parentNode.appendChild(suggestionNode);
      setTimeout(() => {
        parentNode.childNodes.forEach((c) => {
          return c === suggestionNode
            ? parentNode.removeChild(suggestionNode)
            : null;
        });
      }, 7 * 1000);
      if ("srcObject" in mainVideoPlayer) {
        mainVideoPlayer.srcObject = s;
      } else {
        mainVideoPlayer.src = window.URL.createObjectURL(s);
      }
      mainVideoPlayer.addEventListener(
        "loadeddata",
        function (e) {
          const rect = mainVideoPlayer.getClientRects();
          const videoPreview = getCurrentVideoPreview();
          if (rect[0] && videoPreview) {
            const horizontalMargin = (rect[0].x || 1) + 10;
            setPreviewPosition({ horizontalMargin });
            mainVideoPlayer.play();
          }
        },
        false
      );
    },
    removePreview: () => {
      document.getElementById(videoPreviewId)?.remove();
    },
    requestMainVideoFullScreen: () => {
      const mainVideo = document.getElementById(videoMainId);
      if (mainVideo) {
        if (mainVideo.requestFullscreen) {
          mainVideo.requestFullscreen();
          //@ts-expect-error
        } else if (mainVideo.webkitRequestFullscreen) {
          /* Safari */
          //@ts-expect-error
          mainVideo.webkitRequestFullscreen();
        }
      }
    },
    displayPreview: (s: MediaStreamTrack) => {
      return;
      /*const previewVideoPlayer = createPreviewPlayer()
            const stream = new MediaStream()
            stream.addTrack(s)
            const text = document.createTextNode("Your browser does not support HTML5 video.");
            previewVideoPlayer.appendChild(text)
            if ('srcObject' in previewVideoPlayer) {
                previewVideoPlayer.srcObject = stream
            } else {
                previewVideoPlayer.src = window.URL.createObjectURL(stream)
            }
            const rect = document.getElementById(videoMainId)?.getClientRects()
            let horizontalMargin = 10
            if (rect) {
                horizontalMargin = ((rect[0].x || 1) + 10)
            }
            setPreviewPosition({ horizontalMargin })
            parentNode.appendChild(previewVideoPlayer)*/
    },
    addDetailMessage: (str: string) => {
      const newDiv = document.createElement("p");
      newDiv.id = videoModalTextId;
      const newContent = document.createTextNode(str);
      newDiv.style.textAlign = "center";

      newDiv.appendChild(newContent); //añade texto al div creado.

      parentNode.appendChild(newDiv);
    },
    showErrorIcon: () => {
      const icon = document.createElement("i");
      icon.className = "fa fa-window-close";
      icon.ariaHidden = "true";
      icon.style.display = "block";
      icon.style.textAlign = "center";
      icon.style.fontSize = "14rem";
      icon.style.color = BrandColor;

      parentNode.appendChild(icon);
    },
  };
};

type State = {
  currentVideoChat: any;
  isOnCall: boolean;
  currentPeer: RTCPeerConnection | undefined;
};
export const {
  useGlobalState: useVideoState,
  getGlobalState: getGlobalVideoState,
} = createGlobalState<State>({
  currentVideoChat: undefined,
  currentPeer: undefined,
  isOnCall: false,
});

let videoNode: any = undefined;
const setVideoNode = (s: any) => (videoNode = typeof s == "function" ? s() : s);

type InvitationCb = (i: any) => void;
export const UsePeerVideo = (params?: { parentNode?: HTMLElement }) => {
  const [userData] = useGlobalState("userData");
  const [currentVideoChat, setCurrentVideoChat] =
    useVideoState("currentVideoChat");
  const [isAwaitingResponse, setIsAwaitingResponse] = useState<boolean>(false);
  const [isOnCall, setIsOnCall] = useVideoState("isOnCall");
  const [currentPeer, setCurrentPeer] = useVideoState("currentPeer");
  const [onInvitationReceivedCb, setOnInvitationReceivedCb] = useState<
    undefined | InvitationCb
  >();
  const StreamManager = UseMediaStreamManager();
  const player = attachVideoPlayer({ parentNode: videoNode });
  const notificationManager = UseNotificationManager();

  const timeTracker = UseCallTracker();

  useEffect(() => {
    if (!userData) return;
    if (!onInvitationReceivedCb) return;
    const socket = startSocketConnection();
    const evName = "NEW_VIDEO_INVITATION";
    if (!socket?.hasListeners(evName)) {
      socket?.on(evName, (i: any) => {
        onInvitationReceivedCb(i);
      });
    }
    return () => {
      socket?.off(evName);
    };
  }, [userData, onInvitationReceivedCb]);

  useEffect(() => {
    if (params?.parentNode) {
      setVideoNode(params?.parentNode);
      const m = buildDefaultPlayerMessage();
      while (params?.parentNode.firstChild) {
        params?.parentNode.removeChild(params?.parentNode.firstChild);
      }
      params?.parentNode.appendChild(m);
    }
  }, [params?.parentNode]);

  const setChildNode = ({ node }: { node: any }) => {
    if (videoNode) {
      document.getElementById(videoModalTextId)?.remove();
      videoNode.appendChild(node);
    }
  };

  const setModalMessage = (txt: string, removePlayer?: boolean) => {
    const msg = buildDefaultPlayerMessage(txt, removePlayer);
    setChildNode({ node: msg });
  };

  const onInvitationAccepted = async (invitation: any) => {
    setCurrentVideoChat(invitation.videoChat);
    const player = attachVideoPlayer({ parentNode: videoNode });
    player.addDetailMessage("Invitation accepted");
    const socket = startSocketConnection();
    const p = {
      role: Role.VIEWER,
      videoChatUuid: invitation.videoChat.uuid,
      receiverUuid: invitation.receiverUuid,
      clientUserId: "654as8dasd",
      startWithVoice: invitation.videoChat.startWithVoice,
      onReadyToSendTrack: (peer: RTCPeerConnection) => {
        setCurrentPeer(peer);
        player.addDetailMessage("sending tracks to other user");
        /*StreamManager.getMediaStreams({
          //TODO: commented for testing purposes
          //ignoreVideo: true,
        })*/
        /*navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((streams) => {
            streams.getTracks().forEach((track) => {
              peer.addTrack(track, streams);
            });
          });*/
      },
    };
    const client = await getViewClient(p);

    if (client === false) {
      setModalMessage(
        `We could not detect any audio source coming for the other user. Please ask him/her to make sure microphone is setup properly`
      );
      return;
    }

    client.onPeerCreated((peer) => {
      setCurrentPeer(peer);
    });
    client.onNewTrack((stream) => {
      player.addDetailMessage("tracks received");
      if (
        stream.getVideoTracks().length === 0 &&
        invitation.startWithVoice === false
      ) {
        setModalMessage(
          `We could not detect any video source coming for the other user. Please ask him/her to make sure camera is setup properly`
        );
      } else if (
        stream.getAudioTracks().length === 0 &&
        invitation.startWithVoice === true
      ) {
        setModalMessage(
          `We could not detect any audio source coming for the other user. Please ask him/her to make sure microphone is setup properly`
        );
      } else {
        StreamManager.setCurrentRemoteMediaStream(stream);
        const globalMediaStream = new MediaStream(
          invitation.videoChat.startWithVoice
            ? stream.getAudioTracks()
            : stream.getTracks()
        );
        player.addRemoteStream(globalMediaStream);

        socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded());
        socket?.on("STOPPED_VIDEO_BROADCAST", async (i: any) => {
          StreamPool.removeTrack("VIDEO");
          player.addRemoteStream(StreamPool.getGeneratedStream());
        });
        socket?.on("RESUMED_VIDEO_BROADCAST", async (i: any) => {
          const tracks = stream.getVideoTracks();
          StreamPool.addTrack("VIDEO", tracks[0]);
          player.addRemoteStream(StreamPool.getGeneratedStream());
        });

        socket?.on("STOPPED_AUDIO_BROADCAST", async (i: any) => {
          StreamPool.removeTrack("AUDIO");
          player.addRemoteStream(StreamPool.getGeneratedStream());
        });
        socket?.on("RESUMED_AUDIO_BROADCAST", async (i: any) => {
          const tracks = await stream.getAudioTracks();
          StreamPool.addTrack("AUDIO", tracks[0]);
          player.addRemoteStream(StreamPool.getGeneratedStream());
        });

        timeTracker.startTracker({
          callId: invitation.videoChat.id,
          callType: "VIDEO",
        });
        setIsOnCall(true);
      }
    });
  };

  const sendRequest = async ({
    toUserNickname,
    startWithVoice = false,
  }: {
    toUserNickname: string;
    startWithVoice?: boolean;
  }) => {
    StreamManager.getAvailableDevices()
      .then((r) => {
        let promise = null;
        if (startWithVoice === true) {
          if (r.microphone === false) {
            setIsAwaitingResponse(true);
            const msg = buildDefaultPlayerMessage(
              "There is a problem connecting to your microphone. please check your connection to these devices."
            );
            setChildNode({ node: msg });
            setCurrentVideoChat({});
          } else {
            promise = notificationManager.sendInvitation({
              toUserNickname,
              startWithVoice,
            });
          }
        } else if (r.microphone === false && r.webcam === false) {
          setIsAwaitingResponse(true);
          const msg = buildDefaultPlayerMessage(
            "There is a problem connecting to your microphone and camera. please check your connection to these devices."
          );
          setChildNode({ node: msg });
          setCurrentVideoChat({});
        } else {
          promise = notificationManager.sendInvitation({
            toUserNickname,
            startWithVoice,
          });
        }
        if (promise === null) {
          return Promise.reject();
        }
        return promise;
      })
      .then(({ data }) => {
        if (data.statusCode && data.statusCode === 409) {
          setIsAwaitingResponse(true);
          const msg = buildDefaultPlayerMessage(data.message);
          player.addDetailMessage("Could not make the call");
          setChildNode({ node: msg });
          player.showErrorIcon();
          setCurrentVideoChat(data);
        } else {
          setIsAwaitingResponse(true);
          const msg = buildDefaultPlayerMessage("Waiting response");
          player.addDetailMessage("waiting for other user to accept request");
          setChildNode({ node: msg });
          setCurrentVideoChat(data);
          notificationManager.onInvitationRejected(() => {
            onCallEnded();
          });
        }
      });
  };

  const acceptInvitation = ({ invitation }: { invitation: any }) => {
    setCurrentVideoChat(invitation.videoChat);
    const socket = startSocketConnection();
    StreamManager.getAvailableDevices()
      .then((r) => {
        let promise = null;
        if (invitation.startWithVoice === true) {
          if (r.microphone === false) {
            setIsAwaitingResponse(true);
            const msg = buildDefaultPlayerMessage(
              "There is a problem connecting to your microphone. please check your connection to these devices."
            );
            setChildNode({ node: msg });
            setCurrentVideoChat({});
          } else {
            player.addDetailMessage("asking for audio permission");
            promise = StreamManager.getMediaStreams({
              ignoreVideo: invitation.startWithVoice || r.webcam === false,
            });
          }
        } else if (r.microphone === false && r.webcam === false) {
          setIsAwaitingResponse(true);
          const msg = buildDefaultPlayerMessage(
            "There is a problem connecting to your microphone and camera. please check your connection to these devices."
          );
          setChildNode({ node: msg });
          setCurrentVideoChat({});
        } else {
          player.addDetailMessage("asking for audio and video permission");
          promise = StreamManager.getMediaStreams({
            ignoreVideo: invitation.startWithVoice || r.webcam === false,
            ignoreAudio: r.microphone === false,
          });
        }
        if (promise === null) {
          return Promise.reject();
        }
        return promise;
      })
      .then(async (localStream) => {
        if (
          localStream.getVideoTracks().length === 0 &&
          invitation.startWithVoice === false
        ) {
          setModalMessage(
            "We cannot find a video stream from the current device. Please ensure your camera is set up properly."
          );
        } else {
          if (invitation.startWithVoice === false) {
            player.displayPreview(localStream.getVideoTracks()[0]);
          }

          setModalMessage("Waiting for the other user to start the connection");

          /*const streams = await StreamManager.getMediaStreams({
            //TODO: commented for testing purposes
            //ignoreVideo: invitation.videoChat.startWithVoice,
          });*/
          const s = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          const tracks = s.getTracks();
          const p = {
            role: Role.MASTER,
            videoChatUuid: invitation.videoChat.uuid,
            receiverUuid: invitation.receiverUuid,
            startWithVoice: invitation.videoChat.startWithVoice,
            onReadyToSendTrack: (peer: RTCPeerConnection) => {
              setCurrentPeer(peer);
              player.addDetailMessage("sending tracks to other user");
              tracks.forEach((track) => peer.addTrack(track, s));
            },
            onTrack: (stream: MediaStream) => {
              player.addDetailMessage("tracks received");
              StreamManager.setCurrentRemoteMediaStream(stream);
              const globalMediaStream = new MediaStream(
                stream.getAudioTracks()
              );
              player.addRemoteStream(globalMediaStream);

              socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded());
              socket?.on("STOPPED_VIDEO_BROADCAST", async (i: any) => {
                StreamPool.removeTrack("VIDEO");
                player.addRemoteStream(StreamPool.getGeneratedStream());
              });
              socket?.on("RESUMED_VIDEO_BROADCAST", async (i: any) => {
                const tracks = await stream.getVideoTracks();
                StreamPool.addTrack("VIDEO", tracks[0]);
                player.addRemoteStream(StreamPool.getGeneratedStream());
              });

              socket?.on("STOPPED_AUDIO_BROADCAST", async (i: any) => {
                StreamPool.removeTrack("AUDIO");
                player.addRemoteStream(StreamPool.getGeneratedStream());
              });
              socket?.on("RESUMED_AUDIO_BROADCAST", async (i: any) => {
                const tracks = await stream.getAudioTracks();
                StreamPool.addTrack("AUDIO", tracks[0]);
                player.addRemoteStream(StreamPool.getGeneratedStream());
              });
              setIsOnCall(true);
            },
          };
          const client = await GetMasterClient(p);

          if (client === false) {
            setModalMessage(
              "We cannot find a video stream from the current device. Please ensure your camera is set up properly."
            );
            return;
          }

          client.onPeerCreated((peer) => {
            setCurrentPeer(peer);
          });

          client.onError((err) => {
            setModalMessage(
              `There was an error when making the connection to the other client: ${err.toString()}`,
              true
            );
            logActionToServer({
              body: JSON.stringify({
                event: "ACCEPTINVITATION_ERROR",
                message: err.toString(),
              }),
            });
          });
        }
      });
  };

  const onInvitationReceived = (cb: InvitationCb) => {
    setOnInvitationReceivedCb(() => cb);
  };

  const muteMyself = () => {
    StreamManager.stopAudioBroadcast();
    const socket = startSocketConnection();
    const currentVideoChat = getGlobalVideoState("currentVideoChat");
    socket?.emit("STOP_VIDEO_AUDIO_BROADCAST", { currentVideoChat });
  };

  const shareAudio = () => {
    StreamManager.shareAudio();
    const socket = startSocketConnection();
    const currentVideoChat = getGlobalVideoState("currentVideoChat");
    socket?.emit("RESUME_VIDEO_AUDIO_BROADCAST", { currentVideoChat });
  };

  const stopMyVideo = () => {
    StreamManager.stopVideoBroadcast();
    const socket = startSocketConnection();
    const currentVideoChat = getGlobalVideoState("currentVideoChat");
    socket?.emit("STOP_VIDEO_BROADCAST", { currentVideoChat });
    player.removePreview();
  };

  const shareVideo = () => {
    StreamManager.shareVideo();
    const socket = startSocketConnection();
    const currentVideoChat = getGlobalVideoState("currentVideoChat");
    socket?.emit("RESUME_VIDEO_BROADCAST", { currentVideoChat });
  };

  const endCall = (currentChat: any) => {
    console.log("endCall");
    if (!currentChat) return;
    const socket = startSocketConnection();
    socket?.emit("END_VIDEO_CHAT", currentChat);
    socket?.off("INVITATION_ACCEPTED");
    setIsOnCall(false);
    hideVideoModal();
    setIsAwaitingResponse(false);
    setCurrentVideoChat(undefined);
    const message = buildDefaultPlayerMessage();
    setChildNode({ node: message });
    window.location.reload();
  };

  const onCallEnded = () => {
    console.log("onCallEnded");
    const socket = startSocketConnection();
    socket?.off("INVITATION_HANDSHAKE");
    socket?.off("INVITATION_ACCEPTED");
    setIsOnCall(() => false);
    hideVideoModal();
    setIsAwaitingResponse(() => false);
    setCurrentVideoChat(undefined);
    timeTracker.endTracker();
    const m = buildDefaultPlayerMessage();
    setChildNode({ node: m });
    window.location.reload();
  };

  return {
    sendRequest,
    onInvitationAccepted,
    onInvitationReceived,
    acceptInvitation,
    endCall,
    muteMyself,
    stopMyVideo,
    shareVideo,
    shareAudio,
    requestFullScreen: () => {
      player.requestMainVideoFullScreen();
    },
    invitationRequest: notificationManager.invitationRequest,
    isBroadcastingVideo: StreamManager.isBroadcastingVideo(),
    isBroadcastingAudio: StreamManager.isBroadcastingAudio(),
    canStartChat: isOnCall === false && isAwaitingResponse === false,
    isOnCall,
    currentVideoChat,
  };
};
