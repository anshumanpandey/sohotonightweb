import useAxios from "axios-hooks"
import { useEffect, useState } from "react"
import { connect, Room } from "twilio-video"
import { updateCurrentUser, useGlobalState } from "../state/GlobalState"
import { UserData } from "../types/UserData"

const buildDefaultPlayerMessage = () => {
    const newDiv = document.createElement("h2");
    const newContent = document.createTextNode("Wait for a invitation and start a video chat");
    newDiv.appendChild(newContent); //añade texto al div creado.

    return newDiv
}

const buildDefaultPlayer = () => {
    const videoPlayer = document.createElement("video");
    videoPlayer.controls = true
    videoPlayer.style.width = "100%"
    const text = document.createTextNode("Your browser does not support HTML5 video.");
    videoPlayer.appendChild(text)

    return videoPlayer
}

const UseCallTracker = () => {
    const [onDiscountCb, setOnDiscountCb] = useState<() => void | undefined>()
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>()
    const [discountReq, request] = useAxios({
        method: 'POST',
        url: "/video/discount"
    }, { manual: true })

    const onDiscount = (cb: () => void) => {
        setOnDiscountCb(() => cb)
    }

    const onTick = ({ videoChatId }: { videoChatId: string }) => {
        request({ data: { videoChatId }})
        .then(() => updateCurrentUser())
        .then(() => onDiscountCb && onDiscountCb())
    }

    const startTracker = (p: { videoChatId: string }) => {
        console.log("Time tracker started!")
        onTick(p)
        const timer = setInterval(() => onTick(p), 1000 * 95)
        setTimer(timer)
    }

    const endTracker = () => {
        if (timer) {
            clearInterval(timer)
            setTimer(undefined)
        }
    }

    return {
        startTracker,
        endTracker,
        onDiscount
    }
}

export const UseTwilioVideoCall = ({ node }: { node: any}) => {
    const [userData] = useGlobalState("userData")
    const [onCallReceiveCb, setOnCallReceiveCb] = useState<undefined | (() => void)>()
    const [currentRoom, setCurrentRoom] = useState<undefined | Room>()
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [currentHtmlNode, setCurrentHtmlNode] = useState<any | undefined>()

    const tracker = UseCallTracker()

    useEffect(() => {
        if (currentHtmlNode) {
            const message = buildDefaultPlayerMessage()
            setChildNode({ parentNode: currentHtmlNode, node: message })
        }
    }, [currentHtmlNode])

    useEffect(() => {
        if (node) {
            setCurrentHtmlNode(node)
        }
    }, [node])

    const [callTokenReq, request] = useAxios({
        method: 'GET',
    }, { manual: true })

    const setChildNode = ({ node, parentNode }: { node: any, parentNode: any }) => {
        while (parentNode.firstChild) {
            currentHtmlNode?.removeChild(currentHtmlNode.firstChild);
        }

        parentNode.appendChild(node)

    }
    
    const initVideoCall = async (params: { identity: string, toUserNickname: string, divNode: HTMLMediaElement }) => {
        return request({ url: '/video/create', method: "post", data: { identity: params.identity, toUserNickname: params.toUserNickname } })
        .then(({ data }) => {
            return connect(data.token)
            .then((room) => ({ room, data }))
        })
        .then(({ room, data }) => {
            onConnectionSuccess({ room, divNode: params.divNode , onUserConected: () => tracker.startTracker({ videoChatId: data.id }) })
        })
    }

    const onConnectionSuccess = ({ room, divNode, onUserConected }: { room: Room, divNode: HTMLMediaElement, onUserConected?: () => void }) => {
        setIsConnected(true)
        setCurrentHtmlNode(divNode)
        const videoPlayer = buildDefaultPlayer()
        setChildNode({ parentNode: divNode, node: videoPlayer })

        room.on('participantDisconnected', participant => {
            const message = buildDefaultPlayerMessage()
            setChildNode({ parentNode: currentHtmlNode, node: message })
        })


        room.on('participantConnected', participant => {

            console.log(`Participant "${participant.identity}" connected`);
            onUserConected && onUserConected()
            participant.tracks.forEach(publication => {
              if (publication.isSubscribed) {
                const track = publication.track;
                //@ts-ignore
                track?.attach(videoPlayer);
              }
            });

            participant.on('trackSubscribed', track => {
                //@ts-ignore
                track?.attach(videoPlayer);
            });
        });

        room.participants.forEach(participant => {
            participant.tracks.forEach(publication => {
              if (publication.track) {
                //@ts-ignore
                publication.track.attach(videoPlayer);
              }
            });
          
           participant.on('trackSubscribed', track => {
                //@ts-ignore
              track.attach(videoPlayer);
            });
        });

        setCurrentRoom(room)

        /*createLocalVideoTrack().then(track => {
            track.dimensions.height = 100
            track.dimensions.width = 200
            params.track.attach(divNode);
        });*/
    }

    const endCall = () => {
        currentRoom?.disconnect()
        tracker.endTracker()
        const message = buildDefaultPlayerMessage()
        setChildNode({ parentNode: currentHtmlNode, node: message })
    }

    const onVideoChatInvitationReceived = (cb: () => void) => {
        setOnCallReceiveCb(() => cb)
    }

    const getInvitations = () => {
        return request({
            url: '/video/invitations',
        })
        .then((r) => r.data)
    }

    const rejectInvitation = ({ invitationId }: { invitationId: string }) => {
        return request({
            url: '/video/invitation/reject',
            method: 'post',
            data: { invitationId },
        })
        .then((r) => r.data)
    }

    const acceptInvitation = ({ invitation, user, divNode }: { invitation: any, user: UserData, divNode: HTMLMediaElement }) => {
        return request({
            url: '/video/invitation/accept',
            method: 'post',
            data: { invitationId: invitation.id },
        })
        .then((r) => {
            return connectToRoom({ roomName: invitation.videoChat.roomName, identity: user.nickname, divNode })
        })
    }

    const connectToRoom = ({ roomName, identity, divNode }: { identity: string, roomName: string, divNode: any }) => {
        return request({
            url: '/video/generateVideoToken',
            method: 'post',
            data: { identity, roomName }
        })
        .then(({ data }) => connect(data.token))
        .then((room) => onConnectionSuccess({ room, divNode }))
    }

    return {
        initVideoCall,
        endCall,
        onVideoChatInvitationReceived,
        getInvitations,
        rejectInvitation,
        acceptInvitation,
        isConnected
    }
}