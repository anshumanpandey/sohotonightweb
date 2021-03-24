import useAxios from "axios-hooks"
import Peer from "peerjs"
import { useEffect, useState } from "react"
import { startSocketConnection } from "../request/socketClient"
import { useGlobalState } from "../state/GlobalState"
import { UseCallTracker } from "./UseCallTracker"

type CallReceivedCb = (i: any) => void
export const UsePeerCall = () => {
    const [onCallReceivedCb, setOnCallReceivedCb] = useState<undefined | CallReceivedCb>()
    const [userData] = useGlobalState("userData")

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

    const onCallReceived = (cb: CallReceivedCb) => {
        setOnCallReceivedCb(() => cb)
    }

    const onCallAccepted = (invitation: any) => {
        const peer = new Peer(invitation.senderUuid);

        peer.on('connection', () => console.log('connected'))
        peer.on('error', (err) => {
            console.log(err)
        })

        return navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                let call = peer.call(invitation.receiverUuid, stream);
                const globalMediaStream = new MediaStream();

                const socket = startSocketConnection()
                //socket?.on("VIDEO_CHAT_ENDED", (i: any) => onCallEnded({ stream, peer }))

                call.on('error', () => {
                    console.log('could not connect')
                })

                call.on('stream', (remoteStream) => {
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
            })
    }

    const acceptCall = ({ invitation }: { invitation: any }) => {
        const socket = startSocketConnection()

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
                    remoteStream.getTracks()
                        .forEach((s) => {
                            globalMediaStream.addTrack(s)
                        })
                });

                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((localStream) => {
                        call.answer(localStream); // Answer the call with an A/V stream.
                    })
            });


        })
    }

    const rejectCall = () => {

        }

        return {
            onCallReceived,
            sendCallRequest,
            acceptCall
        }
    }