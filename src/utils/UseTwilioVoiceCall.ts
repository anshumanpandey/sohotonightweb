import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

import { Device } from "twilio-client";

export const UseTwilioVoiceCall = ({ identity }: { identity: string }) => {
    const [twilioDevice, setTwilioDevice] = useState<undefined | Device>();
    const [callStatus, setCallStatus] = useState<undefined | string>();
    const [myIdentity, setMyIdentity] = useState<undefined | string>();
    const [deviceIsReady, setDeviceIsReady] = useState<boolean>(false);

    const [callTokenReq, request] = useAxios({
        url: '/call/generateCallToken',
        method: 'GET',
    }, { manual: true })

    useEffect(() => {
        setMyIdentity(identity)
    },[identity])

    useEffect(() => {
        if (!callTokenReq.data) return 
        if (callTokenReq.loading) return 

        console.log(callTokenReq.data.token)
        const device = new Device(callTokenReq.data.token,{ debug: true });

        device.on('incoming', connection => {
            // immediately accepts incoming connection
            connection.accept();

            setCallStatus(connection.status())
        });

        device.on('ready', d => {
            setCallStatus("device ready")
            setDeviceIsReady(true)
            if (identity) {
                device.connect({ recipient: identity })
            }
        });

        device.on('connect', connection => {
            setCallStatus(connection.status())
        });

        device.on('disconnect', connection => {
            setCallStatus(connection.status())
        });

        setTwilioDevice(device)
    }, [callTokenReq.loading])

    const requestCall = ({ identity }: { identity: string }) => {
        request({ url: `/call/generateCallToken?identity=${identity}` })
    }

    return {
        twilioDevice,
        requestCall
    }

}