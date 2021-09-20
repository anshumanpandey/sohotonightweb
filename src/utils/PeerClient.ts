import SimplePeer from "simple-peer";
import {
  dispatchGlobalState,
  getGlobalState,
  GLOBAL_STATE_ACIONS,
} from "../state/GlobalState";
import { AxiosInstance } from "./AxiosBootstrap";

export enum ViewRoles {
  MASTER = "MASTER",
  VIEWER = "VIEWER",
}

type RoleParam = { role: ViewRoles };
type VideoChatIdParam = { videoChatId: string };
export type PeerParams = SimplePeer.Options & RoleParam;

export const buildPeerClient = async (p: PeerParams & VideoChatIdParam) => {
  const servers = await getIceServers(p);
  return new SimplePeer({
    config: {
      iceServers: servers ? [servers] : [],
    },
    ...p,
  });
};

const requestIceServers = (p: RoleParam & VideoChatIdParam) => {
  return AxiosInstance({
    url: `/video/getIceServes/${p.role}/${p.videoChatId}`,
  }).then(({ data }) => data);
};

export const updateIceServers = (p: RoleParam & VideoChatIdParam) => {
  return requestIceServers(p).then((data) => {
    dispatchGlobalState({
      type: GLOBAL_STATE_ACIONS.ICE_SERVERS,
      payload: data,
    });
    return data;
  });
};

export const getIceServers = async (p: RoleParam & VideoChatIdParam) => {
  let iceServer = getGlobalState().iceServer;
  if (!iceServer) {
    iceServer = await updateIceServers(p);
  }
  return iceServer;
};
