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

const buildDefaultPlayerMessage = (text: string = "Wait for a invitation and start a video chat") => {
    const newDiv = document.createElement("h2");
    const newContent = document.createTextNode(text);
    newDiv.style.textAlign = "center"

    newDiv.appendChild(newContent); //añade texto al div creado.

    return newDiv
}

const attachVideoPlayer = ({ parentNode }: { parentNode: HTMLElement }) => {
    const mainVideoPlayer = document.createElement("video");
    mainVideoPlayer.controls = true
    mainVideoPlayer.autoplay = true
    mainVideoPlayer.style.width = "100%"

    const previewVideoPlayer = document.createElement("video");
    previewVideoPlayer.controls = false
    previewVideoPlayer.autoplay = true
    previewVideoPlayer.style.width = "30%"
    previewVideoPlayer.style.height = "30%"
    previewVideoPlayer.style.position = "absolute"
    previewVideoPlayer.style.right = "0"
    previewVideoPlayer.style.top = "0"
    previewVideoPlayer.style.marginTop = "3rem"
    previewVideoPlayer.style.marginRight = "2rem"
    return {
        addRemoteStream: (s: MediaStream) => {
            const text = document.createTextNode("Your browser does not support HTML5 video.");
            mainVideoPlayer.appendChild(text)
            previewVideoPlayer.appendChild(text)
            const suggestionNode = buildPlayerSuggestion()

            while (parentNode.firstChild) {
                parentNode.removeChild(parentNode.firstChild);
            }
            parentNode.appendChild(mainVideoPlayer)
            parentNode.appendChild(previewVideoPlayer)
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
                previewVideoPlayer.style.marginLeft = ((rect[0].x || 1) + 10) + 'px'
                mainVideoPlayer.play()
            }, false);
        },
        addLocalStream: (s: MediaStreamTrack) => {
            const stream = new MediaStream()
            stream.addTrack(s)
            previewVideoPlayer.srcObject = stream
        },
    }
}

export const {
    useGlobalState: useVideoState,
} = createGlobalState<{ currentVideoChat: any }>({ currentVideoChat: undefined });


let videoNode: any = undefined
const setVideoNode = (s: any) => videoNode = typeof s == 'function' ? s() : s

type InvitationCb = (i: any) => void
export const UsePeerVideo = (params?: { parentNode?: HTMLElement }) => {
    const [userData] = useGlobalState("userData")
    const [currentVideoChat, setCurrentVideoChat] = useVideoState("currentVideoChat")
    const [isAwaitingResponse, setIsAwaitingResponse] = useState<boolean>(false)
    const [isOnCall, setIsOnCall] = useState<boolean>(false)
    const [isListening, setIsListening] = useState<boolean>(false)
    const [onInvitationReceivedCb, setOnInvitationReceivedCb] = useState<undefined | InvitationCb>()
    const StreamManager = UseMediaStreamManager()

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
            while (videoNode.firstChild) {
                videoNode.removeChild(videoNode.firstChild);
            }
            videoNode.appendChild(node)
        }
    }

    const setModalMessage = (txt: string) => {
        const msg = buildDefaultPlayerMessage(txt)
        setChildNode({ node: msg })
    }

    const onInvitationAccepted = (invitation: any) => {
        console.log("INVITATION_HANDSHAKE")
        setCurrentVideoChat(invitation.videoChat)
        setModalMessage("Waiting connection")
        const player = attachVideoPlayer({ parentNode: videoNode })
        const socket = startSocketConnection()
        const peer = buildPeerClient();
        peer.on('error', (err) => {
            setModalMessage(`There was an error when making the connection to the other client: ${err.message}`)
            logActionToServer({
                body: JSON.stringify({
                    event: "ONINVITATIONACCEPTED_REMOTESTREAM_TRACK_NUMBER",
                    message: err.message,
                    stack: err.stack,
                })
            })
        })

        socket?.on("INVITATION_HANDSHAKE", (i: any) => {
            console.log(invitation)
            peer.signal(i)
        })
        peer.on('signal', data => {
            console.log({ data })
            socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
        })

        peer.on('stream', (stream: MediaStream) => {
            if (stream.getVideoTracks().length === 0) {
                setModalMessage(`We could not detect any video source coming for the other user. Please ask him to make sure camera is setup properly`)
            } else if (stream.getAudioTracks().length === 0) {
                setModalMessage(`We could not detect any audio source coming for the other user. Please ask him to make sure microphone is setup properly`)
            } else {
                const globalMediaStream = new MediaStream();
                player.addRemoteStream(globalMediaStream)

                logActionToServer({
                    body: JSON.stringify({
                        event: "ONINVITATIONACCEPTED_GET_TRACK",
                        remoteStream: stream
                    })
                })
                stream.getTracks()
                    .forEach((t: any) => {
                        globalMediaStream.addTrack(t)
                        logActionToServer({
                            body: JSON.stringify({
                                event: "ONCALLACCEPTED_REMOTESTREAM_TRACK_NUMBER",
                                amount: t
                            })
                        })
                    })

                timeTracker.startTracker({ callId: invitation.videoChat.id, callType: 'VIDEO' })
                setIsOnCall(true)
            }
        })

        StreamManager.getMediaStreams()
            .then((s) => {
                player.addLocalStream(s.getVideoTracks()[0])
                peer.addStream(s)
                socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded({ stream: s, peer }))
            })
    }

    const sendRequest = async (params: { toUserNickname: string }) => {
        return request({ url: '/video/create', method: "post", data: { toUserNickname: params.toUserNickname } })
            .then(({ data }) => {
                setIsAwaitingResponse(true)
                const msg = buildDefaultPlayerMessage("Waiting response")
                setChildNode({ node: msg })
                setCurrentVideoChat(data)
            })
    }

    const acceptInvitation = ({ invitation }: { invitation: any }) => {
        setCurrentVideoChat(invitation.videoChat)
        const socket = startSocketConnection()
        StreamManager.getMediaStreams()
            .then(localStream => {
                if (localStream.getVideoTracks().length === 0) {
                    setModalMessage("We cannot find a video stream from the current device. Please ensure your camera is set up properly.")
                } else {
                    const player = attachVideoPlayer({ parentNode: videoNode })
                    player.addLocalStream(localStream.getVideoTracks()[0])

                    setModalMessage("Waiting for the other user to start the connection")
                    const peer2 = buildPeerClient({ stream: localStream, initiator: true, trickle: false })
                    const onSignal = (data: any) => {
                        console.log("onSignal")
                        console.log(data)
                        socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
                    }
                    peer2.on('error', err => {
                        setModalMessage(`There was an error when making the connection to the other client: ${err.message}`)
                        peer2.off("signal", onSignal)
                    })
                    peer2.on('signal', onSignal)
                    socket?.on("INVITATION_HANDSHAKE", (i: any) => {
                        peer2.signal(i)
                    })

                    peer2.on('stream', (stream: MediaStream) => {
                        console.log(stream.getVideoTracks())
                        if (stream.getVideoTracks().length === 0) {
                            setModalMessage(`We could not detect any video source coming for the other user. Please ask him to make sure camera is setup properly`)
                        } else if (stream.getAudioTracks().length === 0) {
                            setModalMessage(`We could not detect any audio source coming for the other user. Please ask him to make sure microphone is setup properly`)
                        } else {
                            const globalMediaStream = new MediaStream();
                            player.addRemoteStream(globalMediaStream)
                            logActionToServer({
                                body: JSON.stringify({
                                    event: "ACCEPTINVITATION_GET_TRACK",
                                    remoteStream: stream
                                })
                            })
                            stream.getTracks().forEach((t) => {
                                globalMediaStream.addTrack(t)
                                logActionToServer({
                                    body: JSON.stringify({
                                        event: "ACCEPTINVITATION_REMOTESTREAM_TRACK_NUMBER",
                                        amount: t
                                    })
                                })
                            })
                        }

                        socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded({ stream: localStream, peer: peer2 }))
                    })
                }
            })
    }

    const onInvitationReceived = (cb: InvitationCb) => {
        setOnInvitationReceivedCb(() => cb)
    }

    const endCall = (currentChat: any) => {
        if (!currentChat) return
        const socket = startSocketConnection()
        socket?.emit("END_VIDEO_CHAT", currentChat)
        socket?.off("INVITATION_ACCEPTED")
        setIsListening(false)
        setIsOnCall(false)
        hideVideoModal()
        setIsAwaitingResponse(false)
        setCurrentVideoChat(undefined)
        const message = buildDefaultPlayerMessage()
        setChildNode({ node: message })
        window.location.reload()
    }

    const onCallEnded = ({ peer, stream }: { peer: SimplePeer.Instance, stream: MediaStream }) => {
        peer.destroy()
        const socket = startSocketConnection()
        socket?.off("INVITATION_HANDSHAKE")
        socket?.off("INVITATION_ACCEPTED")
        setIsListening(false)
        setIsOnCall(() => false)
        hideVideoModal()
        setIsAwaitingResponse(() => false)
        setCurrentVideoChat(undefined)
        stream.getTracks().forEach(s => s.stop())
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
        canStartChat: isOnCall === false && isAwaitingResponse === false,
        currentVideoChat
    }

}