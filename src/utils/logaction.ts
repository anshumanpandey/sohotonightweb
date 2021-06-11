import { AxiosInstance } from "./AxiosBootstrap"

export const logActionToServer = ({ body }: { body: string }) => {
    console.log(body)
    return AxiosInstance({ url: '/log', method: 'post', data: { body }})
}