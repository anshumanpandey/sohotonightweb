import useAxios from "axios-hooks"
import { useEffect, useState } from "react"
import { startSocketConnection } from "../request/socketClient"
import { updateCurrentUser } from "../state/GlobalState"

const SECONDS_TO_TICK = 60
export const UseCallTracker = () => {
    let started = false
    const [onDiscountCb, setOnDiscountCb] = useState<() => void | undefined>()
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>()

    useEffect(() => {
        return () => {
            started = false
        }
    }, [])

    const onDiscount = (cb: () => void) => {
        setOnDiscountCb(() => cb)
    }

    const onTick = ({ videoChatId }: { videoChatId: string }) => {
        const socket = startSocketConnection()
        
        Promise.resolve(socket?.emit("DISCOUNT_VIDEO_CHAT", { videoChatId }))
        .then(() => updateCurrentUser())
        .then(() => onDiscountCb && onDiscountCb())
    }

    const startTracker = (p: { videoChatId: string }) => {
        if (started === true) return
        console.log("Time tracker started!")
        started = true
        onTick(p)
        const timer = setInterval(() => onTick(p), 1000 * SECONDS_TO_TICK)
        setTimer(timer)
    }

    const endTracker = () => {
        if (timer) {
            clearInterval(timer)
            setTimer(undefined)
            started = false
        }
    }

    return {
        startTracker,
        endTracker,
        onDiscount
    }
}