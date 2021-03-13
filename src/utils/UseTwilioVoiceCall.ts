import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

import { Device } from "twilio-client";

export const UseTwilioVoiceCall = () => {
    const [twilioDevice, setTwilioDevice] = useState<undefined | Device>();
    const [callStatus, setCallStatus] = useState<undefined | string>();
    const [deviceIsReady, setDeviceIsReady] = useState<boolean>(false);

    const [callTokenReq, request] = useAxios({
        url: 'call/generateCallToken',
        method: 'GET',
    })

    useEffect(() => {
        if (!callTokenReq.data) return 
        console.log(callTokenReq.data.token)
        const device = new Device(callTokenReq.data.token,{ debug: true });

        device.on('incoming', connection => {
            // immediately accepts incoming connection
            connection.accept();

            setCallStatus(connection.status())
        });

        device.on('ready', device => {
            setCallStatus("device ready")
            setDeviceIsReady(true)
        });

        device.on('connect', connection => {
            setCallStatus(connection.status())
        });

        device.on('disconnect', connection => {
            setCallStatus(connection.status())
        });

        setTwilioDevice(device)
    }, [callTokenReq.loading])

    return {
        twilioDevice
    }

}