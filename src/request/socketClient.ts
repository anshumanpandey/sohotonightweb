import * as socketIOClient from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { getGlobalState } from "../state/GlobalState";

let socket: null | socketIOClient.Socket<DefaultEventsMap, DefaultEventsMap> = null
export const startSocketConnection = () => {
    const token = getGlobalState().jwtToken
    if (!token) return null
    if (socket !== null) return socket

    const ENDPOINT = process.env.REACT_APP_SOCKET_URL;
    if (!ENDPOINT) throw new Error("Missing socket url")
    console.log("Connecting")
    socket = socketIOClient.io(ENDPOINT, {
        extraHeaders: { Authorization: `Bearer ${token}` }
    });

    socket.on('unauthorized', (error) => {
        console.log(error)
    });

    return socket
}

export const disconnectSocket = () => socket?.disconnect()

export const answerInvitation = () => {
    startSocketConnection()
    socket?.emit("event", { a: 55 })
}
