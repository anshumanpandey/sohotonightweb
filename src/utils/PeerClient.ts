import SimplePeer from "simple-peer";
import {
  dispatchGlobalState,
  getGlobalState,
  GLOBAL_STATE_ACIONS,
} from "../state/GlobalState";
import { AxiosInstance } from "./AxiosBootstrap";

export const buildPeerClient = async (p?: SimplePeer.Options) => {
  const servers = await getIceServers();
  console.log(servers);
  return new SimplePeer({
    config: {
      iceServers: servers,
    },
    ...p,
  });
};

const requestIceServers = () => {
  return AxiosInstance({
    url: "/video/getIceServes",
  }).then(({ data }) => data);
};

export const updateIceServers = () => {
  requestIceServers().then((data) => {
    dispatchGlobalState({
      type: GLOBAL_STATE_ACIONS.ICE_SERVERS,
      payload: data,
    });
  });
};

export const getIceServers = async () => {
  let iceServers = getGlobalState().iceServes;
  if (iceServers.length === 0) {
    iceServers = await requestIceServers();
  }
  return iceServers;
};
