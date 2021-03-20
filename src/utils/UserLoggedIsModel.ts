import { getGlobalState } from "../state/GlobalState"

export default () => {
    const userData = getGlobalState().userData
    return userData !== null && userData.role == "MODEL"
}