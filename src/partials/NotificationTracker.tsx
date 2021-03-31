import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { UsePeerVideo } from '../hooks/UsePeerVideoChat';
import { UsePeerCall } from '../hooks/UsePeerCall';
import { startSocketConnection } from '../request/socketClient';
import { showVideoChatModal, useGlobalState } from '../state/GlobalState';
import { SohoAlert } from './SohoAlert';

const isVideoChat = (i: any) => {
    return i.videoChat
}

const VoiceCallsTracker: React.FC = () => {
    let history = useHistory();
    const [userData] = useGlobalState("userData")
    const [invitations, setInvitations] = useState<any[]>([])
    const [rejectingVideoChat, setRejectingVideoChat] = useState<boolean>(false)
    const call = UsePeerCall()
    const peerVideo = UsePeerVideo({ })

    const [callTokenReq, request] = useAxios({
        method: 'GET',
        url: '/call/invitations'
    }, { manual: true })

    useEffect(() => {
        peerVideo.listenInvitations()
    }, [])


    useEffect(() => {
        const socket = startSocketConnection()
        socket?.on("NEW_VOICE_INVITATION",(i) => {
            console.log("NEW_VOICE_INVITATION", i)
            setInvitations(p => [i, ...p])
        })
        peerVideo.onInvitationReceived((i) => {
            setInvitations(p => [...p, i])
        })
    }, [userData])

    const updateNotifications = () => {
        return request()
        .then(({ data }) => setInvitations([...data]))
    }

    const notificationIsBusy = () => {
        return callTokenReq.loading === true || rejectingVideoChat === true
    }


    return (
        <>
            {invitations.filter(i => i.responseFromUser === "WAITING_RESPONSE").map((i, idx) => {
                let notificationBody = ``
                if (isVideoChat(i)) {
                    notificationBody = `${i.videoChat.createdBy.nickname} wants to start a video chat with you`
                } else {
                    notificationBody = `${(i.voiceCall).createdBy.nickname} is calling you`
                }
                return <div key={i.id} style={{ zIndex: 200, position: "fixed", left: '50%', transform: 'translateX(-50%)', width: '25%', top: `${15 + (idx * 15)}vh` }}>
                    <SohoAlert
                        autoCloseOnSeconds={15}
                        busy={notificationIsBusy()}
                        body={() => notificationBody}
                        onAccept={() => {
                            if (isVideoChat(i)) {
                                Promise.resolve(showVideoChatModal())
                                .then(() => peerVideo.acceptInvitation({ invitation: i }))
                                .then(() => updateNotifications())
                                
                            } else {
                                call.acceptCall({ invitation: i })
                                .then(() => updateNotifications())
                            }
                        }}
                        onClose={() => {
                            if (isVideoChat(i)) {
                                setRejectingVideoChat(true)
                                peerVideo.rejectInvitation({ invitationId: i.id })
                                .then(() => setRejectingVideoChat(false))
                                .then(() => updateNotifications())
                            } else {
                                call.rejectCall({ invitation: i })
                                .then(() => updateNotifications())
                            }
                        }} />
                </div>
            })}
        </>
    );
}
export default VoiceCallsTracker;
