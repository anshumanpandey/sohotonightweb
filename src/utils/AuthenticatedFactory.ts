export default ({ authenticated, nonAuthenticated }: { authenticated: any, nonAuthenticated?: any }) => {
    if (localStorage.getItem("jwtToken")) {
        return authenticated();
    }

    return nonAuthenticated ? nonAuthenticated() : null
}