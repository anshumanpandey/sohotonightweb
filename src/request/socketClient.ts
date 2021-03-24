import * as socketIOClient from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { getGlobalState } from "../state/GlobalState";

let socket: null | socketIOClient.Socket<DefaultEventsMap, DefaultEventsMap> = null
export const startSocketConnection = () => {
    const token = getGlobalState().jwtToken
    if (!token) return null
    if (socket !== null) return socket

    const ENDPOINT = "http://127.0.0.1:5000";
    console.log("Connecting")
    socket = socketIOClient.io(ENDPOINT, {
        extraHeaders: { Authorization: `Bearer ${token}` }
    });

    return socket
}

export const answerInvitation = () => {
    startSocketConnection()
    socket?.emit("event", { a: 55 })
}
