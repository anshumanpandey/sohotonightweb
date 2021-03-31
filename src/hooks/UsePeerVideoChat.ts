import useAxios from 'axios-hooks';
import SimplePeer from 'simple-peer';
import { useEffect, useState } from 'react';
import { UseCallTracker } from './UseCallTracker';
import { startSocketConnection } from '../request/socketClient';
import { hideVideoModal, updateCurrentUser, useGlobalState } from '../state/GlobalState';
import { createGlobalState } from 'react-hooks-global-state';

const buildDefaultPlayerMessage = (text: string = "Wait for a invitation and start a video chat") => {
    const newDiv = document.createElement("h2");
    const newContent = document.createTextNode(text);
    newDiv.style.textAlign = "center"

    newDiv.appendChild(newContent); //añade texto al div creado.

    return newDiv
}

const buildDefaultPlayer = () => {
    const videoPlayer = document.createElement("video");
    videoPlayer.controls = true
    videoPlayer.autoplay = true
    videoPlayer.style.width = "100%"
    const text = document.createTextNode("Your browser does not support HTML5 video.");
    videoPlayer.appendChild(text)

    return videoPlayer
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
        const socket = startSocketConnection()
        socket?.on("NEW_VIDEO_INVITATION", (i: any) => {
            onInvitationReceivedCb && onInvitationReceivedCb(i)
        })
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
        const peer = new SimplePeer({ });
        const msg = buildDefaultPlayerMessage("Waiting connection")
        setChildNode({ node: msg })

        const socket = startSocketConnection()
        socket?.on("INVITATION_HANDSHAKE", (i: any) => peer.signal(i))

        peer.on('signal', data => {
            socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
        })
        peer.on('error', (err) => {
            console.log(err)
        })

        peer.on('stream', stream => {
            const globalMediaStream = new MediaStream();
            const player = buildDefaultPlayer()
            player.srcObject = globalMediaStream
            setChildNode({ node: player })

            stream.getTracks().forEach((t: any) => globalMediaStream.addTrack(t))

            const socket = startSocketConnection()
            socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded({ stream, peer }))
            timeTracker.startTracker({ callId: invitation.videoChat.id, callType: 'VIDEO' })
            setIsOnCall(true)
        })

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((s) => {
            peer.addStream(s)
        })
    }

    const sendRequest = async (params: { toUserNickname: string }) => {
        return request({ url: '/video/create', method: "post", data: { toUserNickname: params.toUserNickname } })
            .then(() => setIsAwaitingResponse(true))
            .then(() => {
                const msg = buildDefaultPlayerMessage("Waiting response")
                setChildNode({ node: msg })
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
            const peer2 = new SimplePeer({ stream: localStream, initiator: true, trickle: false })
            socket?.on("INVITATION_HANDSHAKE", (i: any) => peer2.signal(i))
            peer2.on('signal', data => {
                socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
            })
            peer2.on('stream', stream => {
                const player = buildDefaultPlayer()
                const globalMediaStream = new MediaStream();
                player.srcObject = globalMediaStream
                setChildNode({ node: player })
                stream.getTracks()
                .forEach((t: any) => globalMediaStream.addTrack(t))
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