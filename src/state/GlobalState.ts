import { createStore } from "react-hooks-global-state";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { UserData } from "../types/UserData";
import { AxiosInstance } from "../utils/AxiosBootstrap";
import { startSocketConnection } from "../request/socketClient";
import { useHistory } from "react-router-dom";

export enum GLOBAL_STATE_ACIONS {
  JWT_TOKEN,
  USER_DATA,
  ABOVE_18,
  TOGGLE_ABOVE_18,
  LOGOUT,
  ERROR,
  INFO,
  SET_SHOW_BUY_MODAL,
  SET_TOWN,
  SET_VISITOR_ID,
  SET_CALL,
  SET_VIDEO_CHAT,
  IS_BUYING_TOKENS,
  SUCCESS,
  GLOBAL_LOADING,
  ICE_SERVERS,
}

const token = localStorage.getItem("jwtToken");
const userData = localStorage.getItem("userData");
const selectedTown = localStorage.getItem("selectedTown");

export type KinesisSetup = {
  servers: RTCIceServer;
  signalingData: {
    role: string;
    arnChannel: string;
    endpointsByProtocol: Record<string, string>;
  };
  receiverUuid?: string;
};

interface State {
  globalLoading: boolean;
  error: null | string;
  info: null | string;
  currentCall: null | string;
  currentVideoChat: null | string;
  visitorId: string | null;
  currentBuyingAsset: null | any;
  success: null;
  selectedTown: null | string;
  jwtToken: null | string;
  userData: null | UserData;
  above18: boolean;
  buyTokenModal: boolean;
  iceServer: null | KinesisSetup;
}

const initialState: State = {
  globalLoading: false,
  error: null,
  info: null,
  currentBuyingAsset: null,
  currentCall: null,
  currentVideoChat: null,
  visitorId: null,
  success: null,
  selectedTown: !selectedTown ? null : selectedTown,
  jwtToken: !token ? null : JSON.parse(token),
  userData: !userData ? null : JSON.parse(userData),
  above18:
    localStorage.getItem("above18") && localStorage.getItem("above18") == "1"
      ? true
      : false,
  buyTokenModal: false,
  iceServer: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case GLOBAL_STATE_ACIONS.GLOBAL_LOADING:
      return { ...state, globalLoading: action.payload };
    case GLOBAL_STATE_ACIONS.SUCCESS:
      return { ...state, success: action.payload };
    case GLOBAL_STATE_ACIONS.INFO:
      return { ...state, info: action.payload };
    case GLOBAL_STATE_ACIONS.ERROR:
      return { ...state, error: action.payload };
    case GLOBAL_STATE_ACIONS.SET_VISITOR_ID:
      return { ...state, visitorId: action.payload };
    case GLOBAL_STATE_ACIONS.SET_CALL:
      return { ...state, currentCall: action.payload };
    case GLOBAL_STATE_ACIONS.IS_BUYING_TOKENS:
      return { ...state, buyTokenModal: action.payload };
    case GLOBAL_STATE_ACIONS.SET_VIDEO_CHAT:
      return { ...state, currentVideoChat: action.payload };
    case GLOBAL_STATE_ACIONS.SET_SHOW_BUY_MODAL:
      return { ...state, currentBuyingAsset: action.payload };
    case GLOBAL_STATE_ACIONS.ICE_SERVERS:
      return { ...state, iceServes: action.payload };

    case GLOBAL_STATE_ACIONS.JWT_TOKEN: {
      localStorage.setItem("jwtToken", JSON.stringify(action.payload));
      return { ...state, jwtToken: action.payload };
    }
    case GLOBAL_STATE_ACIONS.USER_DATA: {
      localStorage.setItem("userData", JSON.stringify(action.payload));
      return { ...state, userData: action.payload };
    }
    case GLOBAL_STATE_ACIONS.ABOVE_18: {
      localStorage.setItem("above18", action.payload == true ? "1" : "0");
      return { ...state, above18: action.payload };
    }
    case GLOBAL_STATE_ACIONS.SET_TOWN: {
      localStorage.setItem("selectedTown", action.payload);
      return { ...state, selectedTown: action.payload };
    }
    case GLOBAL_STATE_ACIONS.TOGGLE_ABOVE_18: {
      const newState = !state.above18;
      localStorage.setItem("above18", newState == true ? "1" : "0");
      return { ...state, above18: newState };
    }
    case GLOBAL_STATE_ACIONS.LOGOUT: {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userData");
      return { ...state, jwtToken: null, userData: null };
    }
    default:
      return state;
  }
};

export const {
  dispatch: dispatchGlobalState,
  useGlobalState,
  getState: getGlobalState,
} = createStore<State, any>(reducer, initialState);

export const startGlobalLoading = () => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.GLOBAL_LOADING,
    payload: true,
  });
};

export const stopGlobalLoading = () => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.GLOBAL_LOADING,
    payload: false,
  });
};

export const setInfoAlert = (msg: string) => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.INFO, payload: msg });
};

export const showBuyTokensModal = (show: boolean) => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.IS_BUYING_TOKENS,
    payload: show,
  });
};

export const showVideoChatModal = () => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.SET_VIDEO_CHAT,
    payload: true,
  });
};

export const hideVideoModal = () => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.SET_VIDEO_CHAT,
    payload: null,
  });
};

export const setSuccessAlert = (msg: string) => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SUCCESS, payload: msg });
};

export const setSelectedTown = (msg: string) => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_TOWN, payload: msg });
};

export const callStarted = ({ toModel }: { toModel: any }) => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.SET_CALL,
    payload: `Waiting for ${toModel.nickname} to respond`,
  });
};
export const callEnded = () => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.SET_CALL,
    payload: "Ending...",
  });
  setTimeout(() => {
    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.SET_CALL, payload: null });
  }, 100);
};

export const updateCallStatus = (callStatus: string) => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.SET_CALL,
    payload: callStatus,
  });
};

export const userIsLogged = () => {
  const s = getGlobalState();
  return s.jwtToken !== null;
};

export const updateCurrentUser = () => {
  return AxiosInstance({
    url: "/user/getUser",
  }).then((r) => {
    dispatchGlobalState({
      type: GLOBAL_STATE_ACIONS.USER_DATA,
      payload: r.data,
    });
  });
};

export const updateVisitorId = () => {
  return FingerprintJS.load()
    .then((fp) => {
      return fp.get();
    })
    .then((result) => {
      dispatchGlobalState({
        type: GLOBAL_STATE_ACIONS.SET_VISITOR_ID,
        payload: result.visitorId,
      });
      return result.visitorId;
    });
};

export const justRegistered = () => {
  const just = localStorage.getItem("justRegistered");

  return just != null;
};

export const setJustRegistered = (justRegistered: boolean) => {
  if (justRegistered === true) {
    localStorage.setItem("justRegistered", "1");
  } else {
    localStorage.removeItem("justRegistered");
  }
};

export const showConfirmBuyingAsset = (asset: any) => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.SET_SHOW_BUY_MODAL,
    payload: asset,
  });
};

export const hideConfirmBuyingAsset = () => {
  dispatchGlobalState({
    type: GLOBAL_STATE_ACIONS.SET_SHOW_BUY_MODAL,
    payload: null,
  });
};

export const UseListenLogoutEvent = () => {
  const eventName = "LOGOUT";
  let history = useHistory();
  const socket = startSocketConnection();

  return {
    startListening: () => {
      if (!socket?.hasListeners(eventName)) {
        socket?.on(eventName, () => {
          history.push("/logout?reason=DUPLICATED_SESSION");
        });
      }
    },
    stopListening: () => {
      socket?.off(eventName);
    },
  };
};
