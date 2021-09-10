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
export type PeerParams = SimplePeer.Options & RoleParam;

export const buildPeerClient = async (p: PeerParams) => {
  const servers = await getIceServers({ role: p.role });
  return new SimplePeer({
    config: {
      iceServers: servers,
    },
    ...p,
  });
};

const requestIceServers = (p: RoleParam) => {
  return AxiosInstance({
    url: `/video/getIceServes/${p.role}`,
  }).then(({ data }) => data);
};

export const updateIceServers = (p: RoleParam) => {
  return requestIceServers(p).then((data) => {
    dispatchGlobalState({
      type: GLOBAL_STATE_ACIONS.ICE_SERVERS,
      payload: data,
    });
    return data;
  });
};

export const getIceServers = async (p: RoleParam) => {
  let iceServers = getGlobalState().iceServes;
  if (iceServers.length === 0) {
    iceServers = await updateIceServers(p);
  }
  return iceServers;
};
