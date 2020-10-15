import { createStore } from 'react-hooks-global-state';

export enum GLOBAL_STATE_ACIONS {
    JWT_TOKEN,
    USER_DATA,
}

const token = localStorage.getItem("jwtToken")
const userData = localStorage.getItem("userData")

const initialState = {
    jtwToken: !token ? null: JSON.parse(token),
    userData: !userData ? null: JSON.parse(userData),
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case GLOBAL_STATE_ACIONS.JWT_TOKEN: {
        localStorage.setItem("jwtToken", JSON.stringify(action.payload))
        return { ...state, jwtToken: action.payload }
    };
    case GLOBAL_STATE_ACIONS.USER_DATA: {
        localStorage.setItem("userData", JSON.stringify(action.payload))
        return { ...state, userData: action.payload };
    }
    default: return state;
  }
};

export const { dispatch: dispatchGlobalState, useGlobalState, getState: getGlobalState } = createStore(reducer, initialState);