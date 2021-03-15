import { createStore } from 'react-hooks-global-state';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { buildCallObject, CallObject } from '../types/CallObject';
import { Device } from 'twilio-client';
import { UserData } from '../types/UserData';

export enum GLOBAL_STATE_ACIONS {
  JWT_TOKEN,
  USER_DATA,
  ABOVE_18,
  TOGGLE_ABOVE_18,
  LOGOUT,
  ERROR,
  INFO,
  SET_TOWN,
  SET_VISITOR_ID,
  SET_CALL,
  SUCCESS,
  GLOBAL_LOADING,
}

const token = localStorage.getItem("jwtToken")
const userData = localStorage.getItem("userData")
const selectedTown = localStorage.getItem("selectedTown")
const callToken = localStorage.getItem("callToken") || undefined

interface State {
  globalLoading: boolean,
  error: null | string,
  info: null | string,
  currentCall: CallObject,
  visitorId: null,
  success: null,
  selectedTown: null | string,
  jwtToken: null | string,
  userData: null | UserData,
  above18: boolean,
}

const initialState: State = {
  globalLoading: false,
  error: null,
  info: null,
  currentCall: buildCallObject({ isCalling: false, callToken: callToken }),
  visitorId: null,
  success: null,
  selectedTown: !selectedTown ? null : selectedTown,
  jwtToken: !token ? null : JSON.parse(token),
  userData: !userData ? null : JSON.parse(userData),
  above18: localStorage.getItem("above18") && localStorage.getItem("above18") == "1" ? true : false,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case GLOBAL_STATE_ACIONS.GLOBAL_LOADING: return { ...state, globalLoading: action.payload }
    case GLOBAL_STATE_ACIONS.SUCCESS: return { ...state, success: action.payload }
    case GLOBAL_STATE_ACIONS.INFO: return { ...state, info: action.payload }
    case GLOBAL_STATE_ACIONS.ERROR: return { ...state, error: action.payload }
    case GLOBAL_STATE_ACIONS.SET_VISITOR_ID: return { ...state, visitorId: action.payload }
    case GLOBAL_STATE_ACIONS.SET_CALL: return { ...state, currentCall: action.payload }    
    
    case GLOBAL_STATE_ACIONS.JWT_TOKEN: {
      localStorage.setItem("jwtToken", JSON.stringify(action.payload))
      return { ...state, jwtToken: action.payload }
    };
    case GLOBAL_STATE_ACIONS.USER_DATA: {
      localStorage.setItem("userData", JSON.stringify(action.payload))
      return { ...state, userData: action.payload };
    }
    case GLOBAL_STATE_ACIONS.ABOVE_18: {
      localStorage.setItem("above18", action.payload == true ? "1" : "0")
      return { ...state, above18: action.payload };
    }
    case GLOBAL_STATE_ACIONS.SET_TOWN: {
      localStorage.setItem("selectedTown", action.payload)
      return { ...state, selectedTown: action.payload };
    }
    case GLOBAL_STATE_ACIONS.TOGGLE_ABOVE_18: {
      const newState = !state.above18
      localStorage.setItem("above18", newState == true ? "1" : "0")
      return { ...state, above18: newState };
    }
    case GLOBAL_STATE_ACIONS.LOGOUT: {
      const newState = !state.above18
      localStorage.removeItem("jwtToken")
      localStorage.removeItem("userData")
      return { ...state, jwtToken: null, userData: null };
    }
    default: return state;
  }
};

export const { dispatch: dispatchGlobalState, useGlobalState, getState: getGlobalState } = createStore<State, any>(reducer, initialState);

export const startGlobalLoading = () => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.GLOBAL_LOADING, payload: true })
}

export const stopGlobalLoading = () => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.GLOBAL_LOADING, payload: false })
}

export const setInfoAlert = (msg: string) => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.INFO, payload: msg })
}

export const setSuccessAlert = (msg: string) => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SUCCESS, payload: msg })
}

export const setSelectedTown = (msg: string) => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_TOWN, payload: msg })
}

export const callStarted = () => {
  const s = getGlobalState()
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_CALL, payload: buildCallObject({ isCalling: true }, s.currentCall ) })
}
export const callEnded = () => {
  const s = getGlobalState()
  s.currentCall.device?.disconnectAll()
  const newCall = buildCallObject({ isCalling: false, callStatus: '' }, s.currentCall)
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_CALL, payload: newCall })
}

export const updateCallStatus = (callStatus: string) => {
  const s = getGlobalState()
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_CALL, payload: buildCallObject({ callStatus }, s.currentCall) })
}

export const setDevice = (device: Device) => {
  const s = getGlobalState()
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_CALL, payload: buildCallObject({ device }, s.currentCall) })
}

export const userIsLogged = () => {
  const s = getGlobalState()
  return s.jwtToken !== null
}

export const updateCallRequestToken = (callToken: string) => {
  localStorage.setItem("callToken", callToken)
  const s = getGlobalState()
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_CALL, payload: buildCallObject({ callToken }, s.currentCall) })
}

export const updateVisitorId = () => {
  return FingerprintJS.load()
  .then((fp) => {
    return fp.get()
  })
  .then((result) => {
    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_VISITOR_ID, payload: result.visitorId })
    return result.visitorId
  })
}

