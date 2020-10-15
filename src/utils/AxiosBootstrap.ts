import { configure } from 'axios-hooks'
import Axios from 'axios'
import { getGlobalState } from '../state/GlobalState'

const AxiosInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})
AxiosInstance.interceptors.request.use((r) => {
  const token = getGlobalState().jtwToken
  if (token) {
    r.headers.Authorization = `Bearer ${token}`
  }
  return r
})
configure({ axios: AxiosInstance })