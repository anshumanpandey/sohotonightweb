import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

import { Device, Connection } from "twilio-client";

export const UseTwilioVoiceCall = () => {
    const [twilioDevice, setTwilioDevice] = useState<undefined | Device>();
    const [callToken, setCallToken] = useState<undefined | string>();
    const [callStatus, setCallStatus] = useState<undefined | string>();
    const [statusListenerCb, setStatusListenerCb] = useState<undefined | ((s: string) => void)>();
    const [callInvitationReceivedCb, setCallInvitationReceivedCb] = useState<undefined | ((s: any) => void)>();
    const [deviceIsReady, setDeviceIsReady] = useState<boolean>(false);

    const [callTokenReq, request] = useAxios({
        method: 'GET',
    }, { manual: true })

    useEffect(() => {
        return () => setCallStatus(undefined)
    }, [])

    useEffect(() => {
        updateStatus()
    }, [callStatus])

    const updateStatus = () => {
        console.log({ callStatus })
        statusListenerCb && statusListenerCb(callStatus || "Starting...")
    }

    const onStatusChange = (cb: (s: string) => void) => {
        setStatusListenerCb(() => cb)
    }

    const requestToken = ({ identity }: { identity: string }) => {
        return request({ url: `/call/generateCallToken?identity=${identity}` })
        .then((r) => {
            setCallToken(r.data.token)
            return r.data.token
        })
    }

    const createTwilioClient = ({ token }: { token: string }) => {
        const device = new Device(token, { debug: true });

        return new Promise<Device>((resolve) => {
            device.on('incoming', (connection: Connection) => {
                // immediately accepts incoming connection
                connection.accept();
                setCallStatus(connection.status())
            });
    
            device.on('ready', d => {
                setCallStatus("device ready")
                setDeviceIsReady(true)
                resolve(device)
            });
    
            device.on('connect', connection => {
                setCallStatus(connection.status())
            });
    
            device.on('disconnect', connection => {
                setCallStatus(connection.status())
            });
    
            setTwilioDevice(device)
        })
    }

    const requestCallTo = ({ toNickname }: { toNickname: string }) => {
        return request({
            url: `/call/create`,
            method: 'POST',
            data: { toUserNickname: toNickname }
        })
        
    }

    const listeCallRequest = () => {
        return request({
            url: `/call/invitations`,
        })
        .then(r => r.data)
        .then((invitations) => invitations.map((i: any) => callInvitationReceivedCb && callInvitationReceivedCb(i)))
    }

    const onCallInvitationReceived = (cb: (i: any) => void) => {
        setCallInvitationReceivedCb(() => cb)
    }

    return {
        requestCallTo,
        requestToken,
        onStatusChange,
        listeCallRequest,
        onCallInvitationReceived,
        callToken
    }

}