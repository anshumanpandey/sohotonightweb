export default (currentLocation: string, currentPage: string) => {
    console.log("currentLocation", currentLocation)
    console.log("currentPage", currentPage)
    console.log("currentPageIs", currentLocation.startsWith(`/${currentPage}`))
    return currentLocation.slice(1) == currentPage
}