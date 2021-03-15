import { Device } from "twilio-client";

export interface CallObject { 
    callToken?: string,
    callStatus?: string,
    isCalling: boolean
    device?: Device
}

export const buildCallObject = (p: Partial<CallObject>, oldCallObj?: null | Partial<CallObject>): CallObject => {
    return { ...oldCallObj, ...p, isCalling: p.isCalling !== undefined ? p.isCalling : oldCallObj?.isCalling || false }
}