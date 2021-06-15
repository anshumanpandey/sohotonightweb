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
        parentNode.removeChild(suggestionNode)
    }, 7 * 1000)
    return {
        addRemoteStream: (s: MediaStream) => {
            mainVideoPlayer.srcObject = s
            mainVideoPlayer.addEventListener( "loadedmetadata", function (e) {
                previewVideoPlayer.style.marginLeft = (this.videoWidth + 50) + 'px'
            }, false );
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

    const listenInvitations = () => {
        console.log({ isListening })
        if (isListening) return
        const socket = startSocketConnection()
        console.log('listening INVITATION_ACCEPTED')
        setIsListening(true)
    }

    const setChildNode = ({ node }: { node: any }) => {
        if (videoNode) {
            while (videoNode.firstChild) {
                videoNode.removeChild(videoNode.firstChild);
            }
            videoNode.appendChild(node)
        }
    }

    const getInvitations = () => {
        return request({
            url: '/video/invitations',
        })
            .then(({ data }) => data)
    }

    const onInvitationAccepted = (invitation: any) => {
        setCurrentVideoChat(invitation.videoChat)
        const peer = buildPeerClient();
        const msg = buildDefaultPlayerMessage("Waiting connection")
        setChildNode({ node: msg })
        const player = attachVideoPlayer({ parentNode: videoNode })

        const socket = startSocketConnection()
        socket?.on("INVITATION_HANDSHAKE", (i: any) => peer.signal(i))

        peer.on('signal', data => {
            socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
            console.log({ onInvitationAcceptedSignal: data })
        })
        peer.on('error', (err) => {
            console.log(err)
            logActionToServer({
                body: JSON.stringify({
                    event: "ONINVITATIONACCEPTED_REMOTESTREAM_TRACK_NUMBER",
                    message: err.message,
                    stack: err.stack,
                })
            })
        })

        peer.on('stream', stream => {
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
        })

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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
                const socket = startSocketConnection()
                socket?.once("INVITATION_ACCEPTED", (i: any) => {
                    if (i.videoChat) {
                        onInvitationAccepted(i)
                    }
                })
                socket?.once("INVITATION_DECLINED", (i: any) => {
                    if (i.videoChat) {
                        setIsAwaitingResponse(false)
                        setCurrentVideoChat(undefined)
                        const message = buildDefaultPlayerMessage()
                        setChildNode({ node: message })
                    }
                })
            })
    }

    const rejectInvitation = ({ invitationId }: { invitationId: string }) => {
        return request({
            url: '/invitation/reject',
            method: 'post',
            data: { invitationId },
        })
    }

    const acceptInvitation = ({ invitation }: { invitation: any }) => {
        const socket = startSocketConnection()
        setCurrentVideoChat(invitation.videoChat)
        setIsAwaitingResponse(false)
        const msg = buildDefaultPlayerMessage("Waiting connection")
        setChildNode({ node: msg })

        return request({
            url: '/invitation/accept',
            method: 'post',
            data: { invitationId: invitation.id }
        })
            .then(() => navigator.mediaDevices.getUserMedia({ video: true, audio: true }))
            .then((localStream) => {
                const player = attachVideoPlayer({ parentNode: videoNode })
                player.addLocalStream(localStream.getVideoTracks()[0])

                const peer2 = buildPeerClient({ stream: localStream, initiator: true, trickle: false })
                socket?.on("INVITATION_HANDSHAKE", (i: any) => peer2.signal(i))
                peer2.on('signal', data => {
                    socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
                })
                peer2.on('stream', stream => {
                    const globalMediaStream = new MediaStream();
                    player.addRemoteStream(globalMediaStream)
                    logActionToServer({
                        body: JSON.stringify({
                            event: "ACCEPTINVITATION_GET_TRACK",
                            remoteStream: stream
                        })
                    })
                    stream.getTracks()
                        .forEach((t: any) => {
                            globalMediaStream.addTrack(t)
                            logActionToServer({
                                body: JSON.stringify({
                                    event: "ACCEPTINVITATION_REMOTESTREAM_TRACK_NUMBER",
                                    amount: t.length
                                })
                            })
                        })
                    socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded({ stream: localStream, peer: peer2 }))
                })
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
        getInvitations,
        sendRequest,
        rejectInvitation,
        onInvitationAccepted,
        onInvitationReceived,
        acceptInvitation,
        listenInvitations,
        endCall,
        canStartChat: isOnCall === false && isAwaitingResponse === false,
        currentVideoChat
    }

}