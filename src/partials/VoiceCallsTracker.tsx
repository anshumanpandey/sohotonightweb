import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { UsePeerCall } from '../hooks/UsePeerCall';
import { startSocketConnection } from '../request/socketClient';
import { useGlobalState } from '../state/GlobalState';
import { SohoAlert } from './SohoAlert';

const VoiceCallsTracker: React.FC = () => {
    const [userData] = useGlobalState("userData")
    const [invitations, setInvitations] = useState<any[]>([])
    const call = UsePeerCall()

    const [callTokenReq, request] = useAxios({
        method: 'GET',
        url: '/call/invitations'
    }, { manual: true })

    useEffect(() => {
        const socket = startSocketConnection()
        socket?.on("NEW_VOICE_INVITATION",(i) => {
            console.log("NEW_VOICE_INVITATION", i)
            setInvitations(p => [i, ...p])
        })
    }, [userData])

    const updateNotifications = () => {
        return request()
        .then(({ data }) => setInvitations(data))
    }

    return (
        <>
            {invitations.filter(i => i.responseFromUser === "WAITING_RESPONSE").map((i, idx) => {
                return <div key={i.id} style={{ position: "fixed", right: 0, width: '20%', top: `${75 - (idx * 15)}vh` }}>
                    <SohoAlert
                        autoCloseOnSeconds={15}
                        busy={callTokenReq.loading}
                        body={() => `${i.voiceCall.createdBy.nickname} is calling you`}
                        onAccept={() => call.acceptCall({ invitation: i }).then(() => updateNotifications())}
                        onClose={() => call.rejectCall({ invitation: i }).then(() => updateNotifications())} />
                </div>
            })}
        </>
    );
}
export default VoiceCallsTracker;
