import useAxios from 'axios-hooks';
import React, { useState } from 'react';
import { UsePeerVideo } from '../hooks/UsePeerVideoChat';
import { UsePeerCall } from '../hooks/UsePeerCall';
import { showVideoChatModal, useGlobalState } from '../state/GlobalState';
import { SohoAlert } from './SohoAlert';
import { UseNotificationManager } from '../hooks/UseNotificationManager';
import { useEffect } from 'react';

const isVideoChat = (i: any) => {
    return i.videoChat
}

const NotificationTracker: React.FC = () => {
    const [userData] = useGlobalState("userData")
    const [rejectingVideoChat, setRejectingVideoChat] = useState<boolean>(false)
    const call = UsePeerCall()
    const peerVideo = UsePeerVideo({ })
    const { notificationsArr, rejectInvitation, acceptInvitation, onInvitationAccepted } = UseNotificationManager()

    const [callTokenReq, request] = useAxios({
        method: 'GET',
        url: '/call/invitations'
    }, { manual: true })

    useEffect(() => {
        onInvitationAccepted(i => {
            if (i && isVideoChat(i)) {
                peerVideo.onInvitationAccepted(i)
            }
        })
    }, [userData])

    const notificationIsBusy = () => {
        return callTokenReq.loading === true || rejectingVideoChat === true
    }

    return (
        <>
            {notificationsArr.filter(i => i.responseFromUser === "WAITING_RESPONSE").map((i, idx) => {
                let notificationBody = ``
                if (isVideoChat(i)) {
                    notificationBody = `${i.videoChat.createdBy.nickname} wants to start a video chat with you`
                } else {
                    notificationBody = `${(i.voiceCall).createdBy.nickname} is calling you`
                }
                return <div key={i.id} style={{ zIndex: 200, position: "fixed", left: '50%', transform: 'translateX(-50%)', minWidth: '25%', maxWidth: '50vw', top: `${15 + (idx * 15)}vh` }}>
                    <SohoAlert
                        autoCloseOnSeconds={15}
                        busy={notificationIsBusy()}
                        body={() => notificationBody}
                        onAccept={() => {
                            if (isVideoChat(i)) {
                                Promise.resolve(showVideoChatModal())
                                .then(() => acceptInvitation({ invitation: i }))
                                .then(() => peerVideo.acceptInvitation({ invitation: i }))
                                
                            } else {
                                call.acceptCall({ invitation: i })
                            }
                        }}
                        onClose={() => {
                            if (isVideoChat(i)) {
                                setRejectingVideoChat(true)
                                rejectInvitation({ invitationId: i.id })
                                .then(() => setRejectingVideoChat(false))
                            } else {
                                rejectInvitation({ invitationId: i.id })
                            }
                        }} />
                </div>
            })}
        </>
    );
}
export default NotificationTracker;
