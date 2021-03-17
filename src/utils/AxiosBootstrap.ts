import { configure } from 'axios-hooks'
import Axios from 'axios'
import { dispatchGlobalState, getGlobalState, GLOBAL_STATE_ACIONS } from '../state/GlobalState'

export const AxiosInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})
AxiosInstance.interceptors.request.use((r) => {
  const token = getGlobalState().jwtToken
  if (token) {
    r.headers.Authorization = `Bearer ${token}`
  }
  return r
})
AxiosInstance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.ERROR, payload: error.response.data.message})
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.ERROR, payload: "The request was made but no response was received"})
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.ERROR, payload: error.message})
    console.log('Error', error.message);
  }
  return Promise.reject(error);
});
configure({ axios: AxiosInstance })