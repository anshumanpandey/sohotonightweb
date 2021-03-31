import useAxios from "axios-hooks"
import SimplePeer from 'simple-peer';
import { useEffect, useState } from "react"
import { startSocketConnection } from "../request/socketClient"
import { callEnded, updateCallStatus, useGlobalState } from "../state/GlobalState"
import { UseCallTracker } from "./UseCallTracker"
import { buildPeerClient } from "../utils/PeerClient";

type CallReceivedCb = (i: any) => void

const buildDefaultPlayer = (m: MediaStream) => {
    const videoPlayer = document.createElement("audio");
    videoPlayer.controls = false
    videoPlayer.autoplay = true
    videoPlayer.id = 'voice-player'
    videoPlayer.style.width = "100%"
    const text = document.createTextNode("Your browser does not support HTML5 video.");
    videoPlayer.appendChild(text)
    videoPlayer.srcObject = m

    return videoPlayer
}

let mainDiv: any = undefined
let audioPlayer: any = undefined

export const UsePeerCall = (p?: { node?: HTMLElement }) => {
    const [onCallReceivedCb, setOnCallReceivedCb] = useState<undefined | CallReceivedCb>()
    const [userData] = useGlobalState("userData")
    const [currentCall] = useGlobalState("currentCall")
    const [currentVoiceChat, setCurrentVoiceChat] = useState<undefined | any>()

    const timeTracker = UseCallTracker()

    const [callTokenReq, request] = useAxios({
        method: 'GET',
    }, { manual: true })

    useEffect(() => {
        const socket = startSocketConnection()
        socket?.on("NEW_VOICE_INVITATION", (i: any) => {
            console.log(i)
            onCallReceivedCb && onCallReceivedCb(i)
        })
    }, [userData, onCallReceivedCb])

    useEffect(() => {
        if (p) {
            mainDiv = p.node
        }
    }, [p])

    useEffect(() => {
        if (currentCall == 'Ending...') {
            endPeerCall()
        }
    }, [currentCall])

    const onCallReceived = (cb: CallReceivedCb) => {
        setOnCallReceivedCb(() => cb)
    }

    const onCallAccepted = (invitation: any) => {
        const peer = buildPeerClient();
        const socket = startSocketConnection()
        setCurrentVoiceChat(invitation.voiceCall)

        peer.on('error', (err) => {
            console.log(err)
        })

        socket?.on("INVITATION_HANDSHAKE", (i: any) => peer.signal(i))
        peer.on('signal', data => {
            socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
        })

        peer.on('stream', (remoteStream) => {
            const globalMediaStream = new MediaStream();

            updateCallStatus("Talking")
            const player = buildDefaultPlayer(remoteStream)
            mainDiv?.appendChild(player)
            audioPlayer = player
            timeTracker.startTracker({ callId: invitation.voiceCall.id, callType: 'VOICE' })
            remoteStream.getTracks()
                .forEach((s: any) => {
                    globalMediaStream.addTrack(s)
                })
        })

        return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((localStream) => {
            peer.addStream(localStream)
            socket?.on("VOICE_CALL_ENDED", (i: any) => {
                localStream.getTracks().forEach(t => t.stop())
                peer.destroy()
                callEnded()
                socket.off("INVITATION_HANDSHAKE")
            })
        })
    }

    const sendCallRequest = ({ toNickname }: { toNickname: string }) => {
        return request({
            url: '/call/create',
            method: 'post',
            data: { toUserNickname: toNickname }
        })
            .then(({ data }) => data)
            .then(() => {
                const socket = startSocketConnection()
                socket?.once("INVITATION_ACCEPTED", (i: any) => {
                    onCallAccepted(i)
                })
                socket?.once("INVITATION_DECLINED", (i: any) => {
                    endPeerCall()
                    callEnded()
                })
            })
    }

    const acceptCall = ({ invitation }: { invitation: any }) => {
        setCurrentVoiceChat(invitation.voiceCall)
        updateCallStatus("Waiting Connection...")
        const socket = startSocketConnection()

        return request({
            url: '/invitation/accept',
            method: 'post',
            data: { invitationId: invitation.id }
        })
            .then(() => navigator.mediaDevices.getUserMedia({ audio: true }))
            .then((localStream) => {
                const peer2 = buildPeerClient({ stream: localStream, initiator: true, trickle: false })
                peer2.on('error', (err) => {
                    console.log(err)
                })

                socket?.on("INVITATION_HANDSHAKE", (i: any) => peer2.signal(i))
                peer2.on('signal', data => {
                    socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
                })

                peer2.on('stream', (remoteStream) => {
                    console.log({ remoteStream })
                    updateCallStatus("Talking")
                    const globalMediaStream = new MediaStream();

                    updateCallStatus("Talking")
                    const player = buildDefaultPlayer(remoteStream)
                    audioPlayer = player
                    mainDiv?.appendChild(player)

                    remoteStream.getTracks()
                        .forEach((s: any) => {
                            globalMediaStream.addTrack(s)
                        })

                    const socket = startSocketConnection()
                    socket?.on("VOICE_CALL_ENDED", (i: any) => {
                        localStream.getTracks().forEach(t => t.stop())
                        peer2.destroy()
                        callEnded()
                        socket.off("INVITATION_HANDSHAKE")
                    })
                })
            })
    }

    const endPeerCall = () => {
        if (!currentVoiceChat) return

        const socket = startSocketConnection()
        socket?.emit("END_VOICE_CHAT", currentVoiceChat)
        socket?.off("INVITATION_ACCEPTED")
        setCurrentVoiceChat(undefined)
    }

    const rejectCall = ({ invitation }: { invitation: any }) => {
        return request({ url: `/invitation/reject`, method: "post", data: { invitationId: invitation.id } })
    }

    return {
        onCallReceived,
        sendCallRequest,
        acceptCall,
        rejectCall,
        audioPlayer
    }
}