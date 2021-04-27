export default ({ user, asset, type}: { user: any, asset: any, type: "VIDEO" | "PICTURE" }) => {
    return user.assetsBought.find((a: any) => {
        if (type == "VIDEO") {
            return a.videoId == asset.id
        }
        if (type == "PICTURE") {
            return a.pictureId == asset.id
        }
        return false
    })
}