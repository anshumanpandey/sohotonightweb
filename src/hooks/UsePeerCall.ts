import useAxios from "axios-hooks"
import { useEffect, useState } from "react"
import { startSocketConnection } from "../request/socketClient"
import { callEnded, updateCallStatus, useGlobalState } from "../state/GlobalState"
import { UseCallTracker } from "./UseCallTracker"
import { buildPeerClient } from "../utils/PeerClient";
import { logActionToServer } from "../utils/logaction";

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
    const [userData] = useGlobalState("userData")
    const [currentCall] = useGlobalState("currentCall")
    const [currentVoiceChat, setCurrentVoiceChat] = useState<undefined | any>()

    const timeTracker = UseCallTracker()

    const [callTokenReq, request] = useAxios({
        method: 'GET',
    }, { manual: true })

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

    const onCallAccepted = (invitation: any) => {
        const peer = buildPeerClient();
        const socket = startSocketConnection()
        setCurrentVoiceChat(invitation.voiceCall)

        peer.on('error', (err) => {
            console.log(err)
            logActionToServer({
                body: JSON.stringify({
                    event: "ONCALLACCEPTED_ERROR_ON_PEER_CREATION",
                    inviation: err.message,
                    stack: err.stack,
                })
            })
        })

        socket?.on("INVITATION_HANDSHAKE", (i: any) => peer.signal(i))
        peer.on('signal', data => {
            socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
            logActionToServer({
                body: JSON.stringify({
                    event: "ONCALLACCEPTED_PEER2_SIGNAL",
                    data: data?.toString(),
                })
            })
        })

        peer.on('stream', (remoteStream) => {
            const globalMediaStream = new MediaStream();

            updateCallStatus("Talking")
            const player = buildDefaultPlayer(remoteStream)
            mainDiv?.appendChild(player)
            audioPlayer = player
            timeTracker.startTracker({ callId: invitation.voiceCall.id, callType: 'VOICE' })
            logActionToServer({
                body: JSON.stringify({
                    event: "ONCALLACCEPTED_GETTING_REMOTE",
                    remoteStream
                })
            })
            remoteStream
                .getTracks()
                .forEach((s: any) => {
                    globalMediaStream.addTrack(s)
                    logActionToServer({
                        body: JSON.stringify({
                            event: "ONCALLACCEPTED_REMOTESTREAM_TRACK_NUMBER",
                            amount: s.length
                        })
                    })
                })
        })

        return navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then((localStream) => {
            peer.addStream(localStream)
            socket?.on("VOICE_CALL_ENDED", (i: any) => {
                localStream.getTracks().forEach(t => t.stop())
                peer.destroy()
                callEnded()
                socket.off("INVITATION_HANDSHAKE")
                window.location.reload()
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
                    logActionToServer({
                        body: JSON.stringify({
                            event: "INVITATION_ACCEPTED",
                            inviation: i
                        })
                    })
                })
                socket?.once("INVITATION_DECLINED", (i: any) => {
                    endPeerCall()
                    callEnded()
                    logActionToServer({
                        body: JSON.stringify({
                            event: "INVITATION_DECLINED",
                            inviation: i
                        })
                    })
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
                    logActionToServer({
                        body: JSON.stringify({
                            event: "ACCEPTCALL_ERROR_ON_PEER_CREATION",
                            inviation: err.message,
                            stack: err.stack,
                        })
                    })
                    console.log(err)
                })

                socket?.on("INVITATION_HANDSHAKE", (i: any) => {
                    logActionToServer({
                        body: JSON.stringify({
                            event: "ACCEPTCALL_SOCKET_INVITATION_HANDSHAKE",
                            data: i?.toString(),
                        })
                    })
                    peer2.signal(i)
                })
                peer2.on('signal', data => {
                    logActionToServer({
                        body: JSON.stringify({
                            event: "ACCEPTCALL_PEER2_SIGNAL",
                            data: data,
                        })
                    })
                    socket?.emit('CONNECTION_HANDSHAKE', { handshake: data, invitation })
                })

                peer2.on('stream', (remoteStream) => {
                    logActionToServer({
                        body: JSON.stringify({
                            event: "ACCEPTCALL_PEER2_STREAM_RECEIVE",
                        })
                    })
                    console.log({ remoteStream })
                    updateCallStatus("Talking")
                    const globalMediaStream = new MediaStream();

                    updateCallStatus("Talking")
                    const player = buildDefaultPlayer(remoteStream)
                    audioPlayer = player
                    mainDiv?.appendChild(player)

                    logActionToServer({
                        body: JSON.stringify({
                            event: "ACCEPTCALL_GETTING_REMOTE",
                            remoteStream
                        })
                    })
                    remoteStream.getTracks()
                        .forEach((s: any) => {
                            globalMediaStream.addTrack(s)
                            logActionToServer({
                                body: JSON.stringify({
                                    event: "ACCEPTCALL_REMOTESTREAM_TRACK_NUMBER",
                                    amount: s.length
                                })
                            })
                        })

                    const socket = startSocketConnection()
                    socket?.on("VOICE_CALL_ENDED", (i: any) => {
                        localStream.getTracks().forEach(t => t.stop())
                        peer2.destroy()
                        callEnded()
                        socket.off("INVITATION_HANDSHAKE")
                        window.location.reload()
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
        window.location.reload()
    }

    const rejectCall = ({ invitation }: { invitation: any }) => {
        return request({ url: `/invitation/reject`, method: "post", data: { invitationId: invitation.id } })
    }

    return {
        sendCallRequest,
        acceptCall,
        rejectCall,
        audioPlayer
    }
}