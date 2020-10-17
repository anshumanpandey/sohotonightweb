import { createStore } from 'react-hooks-global-state';

export enum GLOBAL_STATE_ACIONS {
  JWT_TOKEN,
  USER_DATA,
  ABOVE_18,
  TOGGLE_ABOVE_18,
  LOGOUT,
  ERROR,
  GLOBAL_LOADING,
}

const token = localStorage.getItem("jwtToken")
const userData = localStorage.getItem("userData")

const initialState = {
  globalLoading: false,
  error: null,
  jwtToken: !token ? null : JSON.parse(token),
  userData: !userData ? null : JSON.parse(userData),
  above18: localStorage.getItem("above18") && localStorage.getItem("above18") == "1" ? true : false,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case GLOBAL_STATE_ACIONS.GLOBAL_LOADING: return { ...state, globalLoading: action.payload }
    case GLOBAL_STATE_ACIONS.ERROR: return { ...state, error: action.payload }
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

export const { dispatch: dispatchGlobalState, useGlobalState, getState: getGlobalState } = createStore(reducer, initialState);

export const startGlobalLoading = () => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.GLOBAL_LOADING, payload: true })
}

export const stopGlobalLoading = () => {
  dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.GLOBAL_LOADING, payload: false })
}