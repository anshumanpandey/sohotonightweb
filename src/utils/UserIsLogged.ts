import { getGlobalState } from "../state/GlobalState";

export default () => {
    return localStorage.getItem("jwtToken") != null
}