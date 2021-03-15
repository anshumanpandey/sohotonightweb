import { getGlobalState } from "../state/GlobalState";

export default ({ user }: { user?: any }) => {
    const userData = getGlobalState().userData
    if (!user) return false

    if (localStorage.getItem("jwtToken") && userData?.id == user.id) {
        return true;
    }

    return false
}