import { getGlobalState } from "../state/GlobalState";

export default ({ authenticated, nonAuthenticated, user }: { user: any,authenticated: any, nonAuthenticated?: any }) => {
    const userData = getGlobalState().userData

    if (localStorage.getItem("jwtToken") && userData?.id == user.id) {
        return authenticated();
    }

    return nonAuthenticated ? nonAuthenticated() : null
}