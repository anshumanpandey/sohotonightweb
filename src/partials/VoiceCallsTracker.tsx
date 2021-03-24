import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { UsePeerCall } from '../hooks/UsePeerCall';
import { startSocketConnection } from '../request/socketClient';
import { useGlobalState } from '../state/GlobalState';
import { SohoAlert, useSohoAlert } from './SohoAlert';

const VoiceCallsTracker: React.FC = () => {

    const [userData] = useGlobalState("userData")
    const [invitations, setInvitations] = useState<any[]>([])
    const call = UsePeerCall()

    useEffect(() => {
        const socket = startSocketConnection()
        socket?.on("NEW_VOICE_INVITATION",(i) => {
            console.log("NEW_VOICE_INVITATION", i)
            setInvitations(p => [i, ...p])
        })
    }, [userData])

    return (
        <>
            {invitations.map((i, idx) => {
                return <div style={{ position: "fixed", right: 0, width: '20%', top: `${75 - (idx * 25)}vh` }}>
                    <SohoAlert body={() => "asdasd"} onAccept={() => call.acceptCall({ invitation: i })} onClose={() => {}} />
                </div>
            })}
        </>
    );
}
export default VoiceCallsTracker;
