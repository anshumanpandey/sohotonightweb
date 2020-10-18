import useAxios from 'axios-hooks'

export const SavePayment = () => {
    return useAxios({
        url: 'payment/create/',
        method: 'POST',
    }, { manual: true })
}
