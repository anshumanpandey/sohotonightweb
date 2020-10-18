import useAxios from 'axios-hooks'

export const GetPriceForAsset = ({ type, id }: {type: string, id: string }) => {
    return useAxios({
        url: `assets/single/${type}/${id}`,
    })
}