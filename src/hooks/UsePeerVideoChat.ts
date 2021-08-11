import useAxios from 'axios-hooks';
import SimplePeer from 'simple-peer';
import { useEffect, useState } from 'react';
import { UseCallTracker } from './UseCallTracker';
import { startSocketConnection } from '../request/socketClient';
import { hideVideoModal, useGlobalState } from '../state/GlobalState';
import { createGlobalState } from 'react-hooks-global-state';
import { buildPeerClient } from '../utils/PeerClient';
import { logActionToServer } from '../utils/logaction';
import { BrandColor } from '../utils/Colors';
import Color from 'color';
import { UseMediaStreamManager } from './UseMediaStreamManager';
import { UseNotificationManager } from './UseNotificationManager';

const suggestionDivId = "suggestiondivid"
const buildPlayerSuggestion = () => {
    const newContent = document.createTextNode(`X`);
    const closeMark = document.createElement("span");
    closeMark.setAttribute("aria-hidden", "true")
    closeMark.appendChild(newContent)

    const closeBtn = document.createElement("button");
    closeBtn.type = "button"
    closeBtn.className = "close"
    closeBtn.style.marginTop = "0"
    closeBtn.setAttribute("data-dismiss", "alert")
    closeBtn.setAttribute("aria-label", "Close")
    closeBtn.appendChild(closeMark)

    const suggestionDiv = document.createElement("div");
    suggestionDiv.id = suggestionDivId
    suggestionDiv.className = "alert alert-warning alert-dismissible"
    suggestionDiv.setAttribute("role", "alert")
    suggestionDiv.appendChild(closeBtn)
    suggestionDiv.style.backgroundColor = Color(BrandColor).lighten(0.1).toString()
    suggestionDiv.style.borderColor = Color(BrandColor).lighten(0.4).toString()
    suggestionDiv.style.color = 'white'
    suggestionDiv.style.zIndex = '5'
    suggestionDiv.style.position = 'relative'

    const points = [
        'If video does not start click on play button'
    ]
    const uList = document.createElement("ul");
    points.forEach(point => {
        const el = document.createElement("li");
        el.style.textAlign = 'center'
        const txt = document.createTextNode(point);
        el.appendChild(txt)
        uList.appendChild(el)
    });

    suggestionDiv.appendChild(uList)

    return suggestionDiv
}

const videoModalTextId = "video-modal-text"
const buildDefaultPlayerMessage = (text: string = "Wait for a invitation and start a video chat") => {
    const newDiv = document.createElement("h2");
    newDiv.id = videoModalTextId
    const newContent = document.createTextNode(text);
    newDiv.style.textAlign = "center"

    newDiv.appendChild(newContent); //añade texto al div creado.

    return newDiv
}

const videoPreviewId = "my-video-preview"
const createPreviewPlayer = () => {
    const previewVideoPlayer = document.createElement("video");
    previewVideoPlayer.id = videoPreviewId
    previewVideoPlayer.controls = false
    previewVideoPlayer.autoplay = true
    previewVideoPlayer.style.width = "30%"
    previewVideoPlayer.style.height = "30%"
    previewVideoPlayer.style.position = "absolute"
    previewVideoPlayer.style.right = "0"
    previewVideoPlayer.style.top = "0"
    previewVideoPlayer.style.marginTop = "3rem"
    previewVideoPlayer.style.marginRight = "2rem"
    previewVideoPlayer.style.zIndex = "10"
    return previewVideoPlayer
}

const getCurrentVideoPreview = () => {
    return document.getElementById(videoPreviewId)
}

const setPreviewPosition = ({ horizontalMargin }: { horizontalMargin: number }) => {
    const currentPreview = getCurrentVideoPreview()
    if (currentPreview) {
        currentPreview.style.marginLeft = horizontalMargin + 'px'
    }
}

const attachVideoPlayer = ({ parentNode }: { parentNode: HTMLElement }) => {
    const mainVideoPlayer = document.createElement("video");
    const videoMainId = "my-video"
    mainVideoPlayer.id = videoMainId
    mainVideoPlayer.controls = true
    mainVideoPlayer.autoplay = true
    mainVideoPlayer.style.width = "100%"
    
    return {
        addRemoteStream: (s: MediaStream) => {
            const text = document.createTextNode("Your browser does not support HTML5 video.");
            mainVideoPlayer.appendChild(text)
            const suggestionNode = buildPlayerSuggestion()

            document.getElementById(videoMainId)?.remove()
            document.getElementById(videoModalTextId)?.remove()
            document.getElementById(suggestionDivId)?.remove()            
            
            parentNode.appendChild(mainVideoPlayer)
            parentNode.appendChild(suggestionNode)
            setTimeout(() => {
                parentNode.childNodes.forEach(c => {
                    return c === suggestionNode ? parentNode.removeChild(suggestionNode) : null
                })
            }, 7 * 1000)
            if ('srcObject' in mainVideoPlayer) {
                mainVideoPlayer.srcObject = s
            } else {
                mainVideoPlayer.src = window.URL.createObjectURL(s)
            }
            mainVideoPlayer.addEventListener("loadeddata", function (e) {
                const rect = mainVideoPlayer.getClientRects()
                const videoPreview = getCurrentVideoPreview()
                if (rect[0] && videoPreview) {
                    const horizontalMargin = ((rect[0].x || 1) + 10)
                    setPreviewPosition({ horizontalMargin })
                    mainVideoPlayer.play()
                }
            }, false);
        },
        removePreview: () => {
            document.getElementById(videoPreviewId)?.remove()
        },
        requestMainVideoFullScreen: () => {
            const mainVideo = document.getElementById(videoMainId)
            if (mainVideo) {
                if (mainVideo.requestFullscreen) {
                    mainVideo.requestFullscreen();
                    //@ts-expect-error
                  } else if (mainVideo.webkitRequestFullscreen) { /* Safari */
                    //@ts-expect-error
                    mainVideo.webkitRequestFullscreen();
                  }
            }
        },
        displayPreview: (s: MediaStreamTrack) => {
            const previewVideoPlayer = createPreviewPlayer()
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
            parentNode.appendChild(previewVideoPlayer)
        },
    }
}

type State = {
    currentVideoChat: any,
    isOnCall: boolean,
    currentPeer: SimplePeer.Instance | undefined
}
export const {
    useGlobalState: useVideoState,
    getGlobalState: getGlobalVideoState
} = createGlobalState<State>({ currentVideoChat: undefined, currentPeer: undefined, isOnCall: false });


let videoNode: any = undefined
const setVideoNode = (s: any) => videoNode = typeof s == 'function' ? s() : s

type InvitationCb = (i: any) => void
export const UsePeerVideo = (params?: { parentNode?: HTMLElement }) => {
    const [userData] = useGlobalState("userData")
    const [currentVideoChat, setCurrentVideoChat] = useVideoState("currentVideoChat")
    const [isAwaitingResponse, setIsAwaitingResponse] = useState<boolean>(false)
    const [isOnCall, setIsOnCall] = useVideoState("isOnCall")
    const [currentPeer, setCurrentPeer] = useVideoState("currentPeer")
    const [onInvitationReceivedCb, setOnInvitationReceivedCb] = useState<undefined | InvitationCb>()
    const StreamManager = UseMediaStreamManager()
    const player = attachVideoPlayer({ parentNode: videoNode })
    const notificationManager = UseNotificationManager()

    const timeTracker = UseCallTracker()

    const [callTokenReq, request] = useAxios({
        method: 'GET',
    }, { manual: true })

    useEffect(() => {
        if (!userData) return
        if (!onInvitationReceivedCb) return
        const socket = startSocketConnection()
        const evName = "NEW_VIDEO_INVITATION"
        if (!socket?.hasListeners(evName)) {
            socket?.on(evName, (i: any) => {
                onInvitationReceivedCb(i)
            })
        }
        return () => {
            socket?.off(evName)
        }
    }, [userData, onInvitationReceivedCb])

    useEffect(() => {
        if (params?.parentNode) {
            setVideoNode(params?.parentNode)
            const m = buildDefaultPlayerMessage()
            while (params?.parentNode.firstChild) {
                params?.parentNode.removeChild(params?.parentNode.firstChild);
            }
            params?.parentNode.appendChild(m)
        }
    }, [params?.parentNode])

    const setChildNode = ({ node }: { node: any }) => {
        if (videoNode) {
            document.getElementById(videoModalTextId)?.remove()
            videoNode.appendChild(node)
        }
    }

    const setModalMessage = (txt: string) => {
        const msg = buildDefaultPlayerMessage(txt)
        setChildNode({ node: msg })
    }

    const onInvitationAccepted = (invitation: any) => {
        setCurrentVideoChat(invitation.videoChat)
        setModalMessage("Waiting connection")
        const player = attachVideoPlayer({ parentNode: videoNode })
        const socket = startSocketConnection()
        const peer = buildPeerClient();
        peer.on('error', (err) => {
            setModalMessage(`There was an error when making the connection to the other client: ${err.message}`)
            logActionToServer({
                body: JSON.stringify({
                    event: "ONINVITATIONACCEPTED_PEER_ERROR",
                    message: err.message,
                    stack: err.stack,
                })
            })
        })

        socket?.on("INVITATION_HANDSHAKE", (i: any) => {
            peer.signal(i)
        })
        peer.on('signal', data => {
            socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
        })

        peer.on('stream', (stream: MediaStream) => {
            if (stream.getVideoTracks().length === 0 && invitation.startWithVoice === false) {
                setModalMessage(`We could not detect any video source coming for the other user. Please ask him to make sure camera is setup properly`)
            } else if (stream.getAudioTracks().length === 0 && invitation.startWithVoice === true) {
                setModalMessage(`We could not detect any audio source coming for the other user. Please ask him to make sure microphone is setup properly`)
            } else {
                StreamManager.setCurrentRemoteMediaStream(stream)
                const globalMediaStream = new MediaStream();
                player.addRemoteStream(globalMediaStream)

                logActionToServer({
                    body: JSON.stringify({
                        event: "ONINVITATIONACCEPTED_PEER_STREAM",
                        remoteStream: stream
                    })
                })
                const tracks = invitation.startWithVoice === true ? stream.getAudioTracks() : stream.getTracks()
                tracks
                    .forEach((t: any) => {
                        console.log({ t });
                        globalMediaStream.addTrack(t)
                    })
                logActionToServer({
                    body: JSON.stringify({
                        event: "ONCALLACCEPTED_REMOTESTREAM_TRACKS",
                        amount: tracks
                    })
                })

                socket?.on("STOPPED_VIDEO_BROADCAST", async (i: any) => {
                    const newStream = new MediaStream();
                    const audioTracks = await StreamManager.getRemoteAudio()
                    if (audioTracks) {
                        audioTracks
                        .forEach(t => newStream.addTrack(t))
                    }
                    player.addRemoteStream(newStream)
                })
                socket?.on("RESUMED_VIDEO_BROADCAST", async (i: any) => {
                    const tracks = StreamManager.isBroadcastingAudio() ? StreamManager.getRemoteTracks() : Promise.resolve(stream.getVideoTracks())
                    const tracksToAdd = await tracks
                    console.log("RESUMED_VIDEO_BROADCAST_1",tracksToAdd)
                    const newStream = new MediaStream(tracksToAdd);
                    player.addRemoteStream(newStream)
                    StreamManager.onTrackAdded((newT) => {
                        if (newT) {
                            newStream.addTrack(newT)
                        }
                    })
                })

                timeTracker.startTracker({ callId: invitation.videoChat.id, callType: 'VIDEO' })
                setIsOnCall(true)
            }
        })

        StreamManager.getAvailableDevices()
        .then((r) => {
            return StreamManager.getMediaStreams({
                ignoreVideo: invitation.startWithVoice || r.webcam === false,
                ignoreAudio: r.microphone === false
            })
        })
            .then((s) => {
                if (invitation.startWithVoice === false) {
                    const video = s.getVideoTracks()[0]
                    player.displayPreview(video)
                    logActionToServer({
                        body: JSON.stringify({
                            event: "ONCALLACCEPTED_DISPLAY_PREVIEW",
                            amount: video
                        })
                    })
                }
                peer.addStream(s)
                socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded())
            })
        setCurrentPeer(peer)
    }

    const sendRequest = async ({ toUserNickname, startWithVoice = false }: { toUserNickname: string, startWithVoice?: boolean }) => {
        StreamManager.getAvailableDevices()
        .then((r) => {
            let promise = Promise.reject<any>();
            if (startWithVoice === true) {
                if (r.microphone === false) {
                    setIsAwaitingResponse(true)
                    const msg = buildDefaultPlayerMessage("There is a problem connecting to your microphone. please check your connection to these devices.")
                    setChildNode({ node: msg })
                    setCurrentVideoChat({})
            } else {
                    promise = notificationManager.sendInvitation({ toUserNickname, startWithVoice })
                }
            } else if (r.microphone === false && r.webcam === false) {
                setIsAwaitingResponse(true)
                const msg = buildDefaultPlayerMessage("There is a problem connecting to your microphone and camera. please check your connection to these devices.")
                setChildNode({ node: msg })
                setCurrentVideoChat({})
            } else {
                promise = notificationManager.sendInvitation({ toUserNickname, startWithVoice })
            }
            return promise
        })
            .then(({ data }) => {
                setIsAwaitingResponse(true)
                const msg = buildDefaultPlayerMessage("Waiting response")
                setChildNode({ node: msg })
                setCurrentVideoChat(data)
                notificationManager.onInvitationRejected(() => {
                    onCallEnded()
                })
            })
    }

    const acceptInvitation = ({ invitation }: { invitation: any }) => {
        setCurrentVideoChat(invitation.videoChat)
        const socket = startSocketConnection()
        StreamManager.getAvailableDevices()
        .then((r) => {
            let promise = Promise.reject<any>();
            if (invitation.startWithVoice === true) {
                if (r.microphone === false) {
                    setIsAwaitingResponse(true)
                    const msg = buildDefaultPlayerMessage("There is a problem connecting to your microphone. please check your connection to these devices.")
                    setChildNode({ node: msg })
                    setCurrentVideoChat({})
            } else {
                    promise = StreamManager.getMediaStreams({ ignoreVideo: invitation.startWithVoice || r.webcam === false })
                }
            } else if (r.microphone === false && r.webcam === false) {
                setIsAwaitingResponse(true)
                const msg = buildDefaultPlayerMessage("There is a problem connecting to your microphone and camera. please check your connection to these devices.")
                setChildNode({ node: msg })
                setCurrentVideoChat({})
            } else {
                promise = StreamManager.getMediaStreams({
                    ignoreVideo: invitation.startWithVoice || r.webcam === false,
                    ignoreAudio: r.microphone === false
                })
            }
            return promise
        })
            .then(localStream => {
                if (localStream.getVideoTracks().length === 0 && invitation.startWithVoice === false) {
                    setModalMessage("We cannot find a video stream from the current device. Please ensure your camera is set up properly.")
                } else {
                    if (invitation.startWithVoice === false) {
                        player.displayPreview(localStream.getVideoTracks()[0])
                    }

                    setModalMessage("Waiting for the other user to start the connection")
                    const peer2 = buildPeerClient({ stream: localStream, initiator: true, trickle: true })
                    const onSignal = (data: any) => {
                        socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
                    }
                    peer2.on('error', err => {
                        setModalMessage(`There was an error when making the connection to the other client: ${err.message}`)
                        peer2.off("signal", onSignal)
                        logActionToServer({
                            body: JSON.stringify({
                                event: "ACCEPTINVITATION_ERROR",
                                message: err.message,
                                stack: err.stack,
                            })
                        })
                    })
                    peer2.on('signal', onSignal)
                    socket?.on("INVITATION_HANDSHAKE", (i: any) => {
                        peer2.signal(i)
                    })

                    peer2.on('stream', async (stream: MediaStream) => {
                        logActionToServer({
                            body: JSON.stringify({
                                event: "ACCEPTINVITATION_ONSTREAM_PEER_EVENT",
                                remoteStream: stream
                            })
                        })
                        console.log(stream)
                        console.log(stream.getVideoTracks())
                        console.log(stream.getAudioTracks())
                        if (stream.getVideoTracks().length === 0 && invitation.startWithVoice === false) {
                            setModalMessage(`We could not detect any video source coming for the other user. Please ask him to make sure camera is setup properly`)
                        } else if (stream.getAudioTracks().length === 0 && invitation.startWithVoice === true) {
                            setModalMessage(`We could not detect any audio source coming for the other user. Please ask him to make sure microphone is setup properly`)
                        } else {
                            StreamManager.setCurrentRemoteMediaStream(stream)
                            const tracks = await StreamManager.getRemoteTracks()
                            const globalMediaStream = new MediaStream(tracks);
                            player.addRemoteStream(globalMediaStream)
                            logActionToServer({
                                body: JSON.stringify({
                                    event: "ACCEPTINVITATION_STREAM",
                                    remoteStream: stream
                                })
                            })
                        }

                        socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded())
                        socket?.on("STOPPED_VIDEO_BROADCAST", async (i: any) => {
                            const m = await StreamManager.getRemoteAudio()
                            const newStream = new MediaStream(m);
                            player.addRemoteStream(newStream)
                        })
                        socket?.on("RESUMED_VIDEO_BROADCAST", async (i: any) => {
                            const tracks = stream.getVideoTracks()
                            console.log("RESUMED_VIDEO_BROADCAST_2",tracks)
                            const audioTracks = await StreamManager.getRemoteAudio()
                            const newStream = new MediaStream(tracks.concat(audioTracks));
                            player.addRemoteStream(newStream)
                            StreamManager.onTrackAdded((newT) => {
                                if (newT) {
                                    newStream.addTrack(newT)
                                }
                            })
                        })
                        setIsOnCall(true)
                    })
                    setCurrentPeer(peer2)
                }
            })
    }

    const onInvitationReceived = (cb: InvitationCb) => {
        setOnInvitationReceivedCb(() => cb)
    }

    const muteMyself = () => {
        StreamManager.stopAudioBroadcast()
        const socket = startSocketConnection()
        const currentVideoChat = getGlobalVideoState("currentVideoChat")
        socket?.emit('STOP_VIDEO_AUDIO_BROADCAST', { currentVideoChat })
    }

    const shareAudio = () => {
        StreamManager.shareAudio()
        const socket = startSocketConnection()
        const currentVideoChat = getGlobalVideoState("currentVideoChat")
        socket?.emit('RESUME_VIDEO_AUDIO_BROADCAST', { currentVideoChat })
    }

    const stopMyVideo = () => {
        StreamManager.stopVideoBroadcast()
        const socket = startSocketConnection()
        const currentVideoChat = getGlobalVideoState("currentVideoChat")
        socket?.emit('STOP_VIDEO_BROADCAST', { currentVideoChat })
        player.removePreview()
    }

    const shareVideo = () => {
        StreamManager
        .shareVideo({ peer: currentPeer })
        ?.then((localMedia) => {
            if (localMedia) {
                const videoT = localMedia.getVideoTracks()[0]
                if (videoT) {
                    player.displayPreview(videoT)
                }
            }
        })
        const socket = startSocketConnection()
        const currentVideoChat = getGlobalVideoState("currentVideoChat")
        socket?.emit('RESUME_VIDEO_BROADCAST', { currentVideoChat })
    }

    const endCall = (currentChat: any) => {
        if (!currentChat) return
        const socket = startSocketConnection()
        socket?.emit("END_VIDEO_CHAT", currentChat)
        socket?.off("INVITATION_ACCEPTED")
        setIsOnCall(false)
        hideVideoModal()
        setIsAwaitingResponse(false)
        setCurrentVideoChat(undefined)
        const message = buildDefaultPlayerMessage()
        setChildNode({ node: message })
        window.location.reload()
    }

    const onCallEnded = () => {
        const socket = startSocketConnection()
        socket?.off("INVITATION_HANDSHAKE")
        socket?.off("INVITATION_ACCEPTED")
        setIsOnCall(() => false)
        hideVideoModal()
        setIsAwaitingResponse(() => false)
        setCurrentVideoChat(undefined)
        timeTracker.endTracker()
        const m = buildDefaultPlayerMessage()
        setChildNode({ node: m })
        window.location.reload()
    }

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
            player.requestMainVideoFullScreen()
        },
        isBroadcastingVideo: StreamManager.isBroadcastingVideo(),
        isBroadcastingAudio: StreamManager.isBroadcastingAudio(),
        canStartChat: isOnCall === false && isAwaitingResponse === false,
        isOnCall,
        currentVideoChat
    }

}