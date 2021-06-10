import { AxiosInstance } from "./AxiosBootstrap"

export const logActionToServer = ({ body }: { body: string }) => {
    return AxiosInstance({ url: '/log', method: 'post', data: { body }})
}