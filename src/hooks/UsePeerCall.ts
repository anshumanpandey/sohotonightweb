import useAxios from "axios-hooks"
import Peer from "peerjs"
import { useEffect, useState } from "react"
import { startSocketConnection } from "../request/socketClient"
import { callEnded, updateCallStatus, useGlobalState } from "../state/GlobalState"
import { UseCallTracker } from "./UseCallTracker"

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
        const peer = new Peer(invitation.senderUuid);
        setCurrentVoiceChat(invitation.voiceCall)

        peer.on('connection', () => console.log('connected'))
        peer.on('error', (err) => {
            console.log(err)
        })

        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                let call = peer.call(invitation.receiverUuid, stream);
                const globalMediaStream = new MediaStream();

                const socket = startSocketConnection()
                socket?.on("VOICE_CALL_ENDED", (i: any) => {
                    stream.getTracks().forEach(t => t.stop())
                    callEnded()
                })

                call.on('error', () => {
                    console.log('could not connect')
                })

                call.on('stream', (remoteStream) => {
                    updateCallStatus("Talking")
                    const player = buildDefaultPlayer(remoteStream)
                    mainDiv?.appendChild(player)
                    audioPlayer = player
                    remoteStream.getTracks()
                        .forEach((s) => {
                            globalMediaStream.addTrack(s)
                            timeTracker.startTracker({ callId: invitation.voiceCall.id, callType: 'VOICE' })
                        })
                });
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
        const socket = startSocketConnection()
        setCurrentVoiceChat(invitation.voiceCall)
        updateCallStatus("Waiting Connection...")

        return new Promise<void>((resolve, rejected) => {
            const peer = new Peer(invitation.receiverUuid);

            peer.on('open', () => {
                console.log('open')
                socket?.emit("ACCEPT_INVITATION", invitation)
                resolve()
            })
            peer.on('error', (err) => {
                console.log(err)
                rejected(err)
            })

            peer.on('call', (call) => {
                const globalMediaStream = new MediaStream();

                call.on('stream', (remoteStream) => {
                    updateCallStatus("Talking")
                    const player = buildDefaultPlayer(remoteStream)
                    audioPlayer = player
                    mainDiv?.appendChild(player)

                    remoteStream.getTracks()
                        .forEach((s) => {
                            globalMediaStream.addTrack(s)
                        })
                });

                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((localStream) => {
                        call.answer(localStream); // Answer the call with an A/V stream.
                        const socket = startSocketConnection()
                        socket?.on("VOICE_CALL_ENDED", (i: any) => {
                            localStream.getTracks().forEach(t => t.stop())
                        })
                    })
            });


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
        return request({ url: `/invitation/reject`, method: "post", data: { invitationId: invitation.id }})
    }

    return {
        onCallReceived,
        sendCallRequest,
        acceptCall,
        rejectCall,
        audioPlayer
    }
}