import useAxios from 'axios-hooks';
import Peer from 'peerjs';
import { useEffect, useState } from 'react';

const buildDefaultPlayer = () => {
    const videoPlayer = document.createElement("video");
    videoPlayer.controls = true
    videoPlayer.style.width = "100%"
    const text = document.createTextNode("Your browser does not support HTML5 video.");
    videoPlayer.appendChild(text)

    return videoPlayer
}

export const UsePeerVideo = ({ parentNode }: { parentNode: HTMLElement }) => {
    const [acceptedCalls, setAcceptedCalls] = useState<any[]>([])
    const [cb, setcb] = useState<boolean>(false)
    const [videoNode, setVideoNode] = useState<HTMLElement | undefined>()

    const [callTokenReq, request] = useAxios({
        method: 'GET',
    }, { manual: true })

    useEffect(() => {
        if (acceptedCalls[0] && cb === false) {
            onInvitationAccepted(acceptedCalls[0])
            setcb(true)
        }
    }, [acceptedCalls])

    useEffect(() => {
        setVideoNode(parentNode)
    },[parentNode])

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

    const getAcceptedInvitations = () => {
        return request({
            url: '/video/acceptedInvitations',
        })
            .then(({ data }) => setAcceptedCalls(data))
    }

    const onInvitationAccepted = (invitation: any) => {
        const peer = new Peer(invitation.senderUuid);

        peer.on('connection', () => console.log('connected'))
        peer.on('error', (err) => {
            console.log(err)
        })

        return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                let call = peer.call(invitation.receiverUuid, stream);
                const globalMediaStream = new MediaStream();
                const player = buildDefaultPlayer()
                player.srcObject = globalMediaStream
                setChildNode({ node: player })

                call.on('error', () => {
                    console.log('could not connect')
                })

                call.on('stream', (remoteStream) => {
                    remoteStream.getTracks()
                    .forEach((s) => {
                        globalMediaStream.addTrack(s)
                    })
                });
            })
    }

    const sendRequest = async (params: { toUserNickname: string }) => {
        const player = buildDefaultPlayer()
        setChildNode({ node: player })
        return request({ url: '/video/create', method: "post", data: { toUserNickname: params.toUserNickname } })
    }

    const rejectInvitation = ({ invitationId }: { invitationId: string }) => {
        return request({
            url: '/video/invitation/reject',
            method: 'post',
            data: { invitationId },
        })
    }

    const acceptInvitation = ({ invitation, divNode }: { invitation: any, divNode: HTMLMediaElement }) => {
        return request({
            url: '/video/invitation/accept',
            method: 'post',
            data: { invitationId: invitation.id },
        })
            .then((r) => {
                const peer = new Peer(invitation.receiverUuid);

                peer.on('connection', () => console.log('connected'))
                peer.on('error', (err) => {
                    console.log(err)
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
                        })
                });
            })
    }

    return {
        getInvitations,
        sendRequest,
        rejectInvitation,
        acceptInvitation,
        onInvitationAccepted,
        getAcceptedInvitations
    }

}

export const connect = ({ invitation }: { invitation: any }) => {
    let errorCounter = 0
    const peer = new Peer(invitation.senderUuid);

    peer.on('connection', () => console.log('connected'))
    peer.on('error', (err) => {
        console.log(err)
    })

    return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            return new Promise((resolve, rejected) => {
                let call = peer.call("123456", stream);
                const globalMediaStream = new MediaStream();

                call.on('error', () => {
                    if (errorCounter != 3) {
                        errorCounter = 1 + errorCounter
                        console.log(`connection atemp ${errorCounter}`)
                        call = peer.call("123456", stream)
                    } else {
                        rejected('vould not connect')
                    }
                })

                call.on('stream', (remoteStream) => {

                });
            })
        })

}

export const listenCalls = ({ peerId, node }: { peerId: string, node: HTMLMediaElement }) => {
    const store = new Map<string, Peer.MediaConnection>()

    const acceptCall = (id: string) => {
        const globalMediaStream = new MediaStream();

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((remoteStream) => {
                store.get(id)?.answer(remoteStream); // Answer the call with an A/V stream.
                remoteStream.getTracks()
                    .forEach((s) => {
                        globalMediaStream.addTrack(s)
                    })
            })
    }

    const listen = () => {
        const peer = new Peer(peerId, { debug: 2 });
        const globalMediaStream = new MediaStream();
        node.srcObject = globalMediaStream

        peer.on('connection', (a) => {
            console.log(a)
        })
        peer.on('error', (err) => {
            console.log(err)
        })
        peer.on('call', (call) => {
            store.set("d", call)
        });
    }

    return {
        listen
    }

}