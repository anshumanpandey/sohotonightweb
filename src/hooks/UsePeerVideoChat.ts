import useAxios from 'axios-hooks';
import Peer from 'peerjs';
import { useEffect, useState } from 'react';
import { UseCallTracker } from './UseCallTracker';
import { startSocketConnection } from '../request/socketClient';
import { updateCurrentUser, useGlobalState } from '../state/GlobalState';

const buildDefaultPlayerMessage = () => {
    const newDiv = document.createElement("h2");
    const newContent = document.createTextNode("Wait for a invitation and start a video chat");
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

let currentVideoChat: any = undefined
const setCurrentVideoChat = (s: any) => currentVideoChat = typeof s == 'function' ? s() : s


type InvitationCb = (i: any) => void
export const UsePeerVideo = ({ parentNode }: { parentNode: HTMLElement }) => {
    const [userData] = useGlobalState("userData")
    const [isAwaitingResponse, setIsAwaitingResponse] = useState<boolean>(false)
    const [isOnCall, setIsOnCall] = useState<boolean>(false)
    const [isListening, setIsListening] = useState<boolean>(false)
    const [onInvitationReceivedCb, setOnInvitationReceivedCb] = useState<undefined | InvitationCb>()
    const [videoNode, setVideoNode] = useState<HTMLElement | undefined>()

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
        if (parentNode) {
            setVideoNode(parentNode)
            const m = buildDefaultPlayerMessage()
            while (parentNode.firstChild) {
                parentNode.removeChild(parentNode.firstChild);
            }
            parentNode.appendChild(m)
        }
    }, [parentNode])

    const listenInvitations = () => {
        if (isListening) return
        const socket = startSocketConnection()
        console.log('listening INVITATION_ACCEPTED')
        setIsListening(true)
        socket?.on("INVITATION_ACCEPTED", (i: any) => {
            if (i.videoChat) { 
                onInvitationAccepted(i)
            }
        })
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
        setCurrentVideoChat(() => ({ ...invitation.videoChat }))
        const peer = new Peer(invitation.senderUuid);

        peer.on('connection', () => console.log('connected'))
        peer.on('error', (err) => {
            console.log(err)
        })

        peer.on('open', () => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                let call = peer.call(invitation.receiverUuid, stream);
                const globalMediaStream = new MediaStream();
                const player = buildDefaultPlayer()
                player.srcObject = globalMediaStream
                setChildNode({ node: player })

                const socket = startSocketConnection()
                socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded({ stream, peer }))


                call.on('error', () => {
                    console.log('could not connect')
                })

                call.on('stream', (remoteStream) => {
                    remoteStream.getTracks()
                        .forEach((s) => {
                            globalMediaStream.addTrack(s)
                        })
                        setIsOnCall(true)
                        timeTracker.startTracker({ callId: invitation.videoChat.id, callType: 'VIDEO' })
                });
            })
        })
    }

    const sendRequest = async (params: { toUserNickname: string }) => {
        const player = buildDefaultPlayer()
        setChildNode({ node: player })
        return request({ url: '/video/create', method: "post", data: { toUserNickname: params.toUserNickname } })
        .then(() => setIsAwaitingResponse(true))
        .then(() => {
            const socket = startSocketConnection()
            socket?.once("INVITATION_DECLINED", (i: any) => {
                console.log('invitation declined', i)
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

        return new Promise<any>((resolve, rejected) => {
            const peer = new Peer(invitation.receiverUuid);
            setCurrentVideoChat(invitation.videoChat)
            setIsAwaitingResponse(false)

            peer.on('open', () => {
                console.log('open')
                request({
                    url: '/invitation/accept',
                    method: 'post',
                    data: { invitationId: invitation.id }
                })
                .then((res) => resolve(res))
                .catch((err) => resolve(err))
            })
            peer.on('error', (err) => {
                console.log(err)
                rejected(err)
            })

            peer.on('call', (call) => {
                const player = buildDefaultPlayer()
                const globalMediaStream = new MediaStream();
                player.srcObject = globalMediaStream
                setChildNode({ node: player })

                call.on('stream', (remoteStream) => {
                    remoteStream.getTracks()
                        .forEach((s) => {
                            globalMediaStream.addTrack(s)
                        })
                });

                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then((localStream) => {
                        call.answer(localStream); // Answer the call with an A/V stream.
                        socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded({ stream: localStream, peer }))
                    })
            });
        })
    }

    const onInvitationReceived = (cb: InvitationCb) => {
        setOnInvitationReceivedCb(() => cb)
    }

    const endCall = (currentChat: any) => {
        if (!currentChat) return
        const socket = startSocketConnection()
        socket?.emit("END_VIDEO_CHAT", currentChat)
        setIsOnCall(false)
        setCurrentVideoChat(undefined)
        const message = buildDefaultPlayerMessage()
        setChildNode({ node: message })
    }

    const onCallEnded = ({ peer, stream }: { peer: Peer, stream: MediaStream }) => {
        peer.disconnect()
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