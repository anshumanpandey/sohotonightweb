import { Role, SignalingClient } from "amazon-kinesis-video-streams-webrtc";
import { SignalingClientConfig } from "amazon-kinesis-video-streams-webrtc/lib/SignalingClient";
import {
  dispatchGlobalState,
  getGlobalState,
  GLOBAL_STATE_ACIONS,
  KinesisSetup,
} from "../../state/GlobalState";
import { AwsConfig, getAwsCredentials } from "../AwsClient";
import { AxiosInstance } from "../AxiosBootstrap";
import { KinesisVideoSignalingChannels } from "aws-sdk";
import { GetMasterClient } from "./MasterClient";
import { getViewClient } from "./ViewerClient";

export type RoleParams = { role: Role };
export type ChannelNameParams = { arnChannel: string };
export type ArnChannelParams = { arnChannel: string };
export type EndpointByProtocolParams = {
  endpointsByProtocol: Record<string, string>;
};

type RoleParam = { role: Role };
type VideoChatIdParam = { videoChatId: string };
type CreatedByUser = { receiverUuid?: string };
export type PeerParams = Partial<RTCPeerConnection> & RoleParam;

export const buildPeerClient = async (
  p: PeerParams & VideoChatIdParam & CreatedByUser & { startWithVoice: boolean }
) => {
  const clientfn = p.role === Role.VIEWER ? getViewClient : GetMasterClient;
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

export const createSignalingClient = async (data: KinesisSetup) => {
  const awsCredentials = await getAwsCredentials();

  if (!awsCredentials.key || !awsCredentials.secret) {
    return false;
  }

  const config: SignalingClientConfig = {
    channelARN: data.signalingData.arnChannel,
    channelEndpoint: data.signalingData.endpointsByProtocol.WSS,
    role: data.signalingData.role as Role,
    region: AwsConfig.region,
    clientId:
      data.signalingData.role === Role.VIEWER && data.receiverUuid
        ? data.receiverUuid
        : undefined,
    credentials: {
      accessKeyId: awsCredentials.key,
      secretAccessKey: awsCredentials.secret,
    },
  };

  const signalingClient = new SignalingClient(config);

  return signalingClient;
};

export const createSignalingChannel = async (
  p: RoleParam & VideoChatIdParam
) => {
  const awsCredentials = await getAwsCredentials();
  console.log({ awsCredentials });
  if (!awsCredentials.key || !awsCredentials.secret) {
    return false;
  }
  const data = await getIceServers(p);
  if (!data) {
    return false;
  }

  const config: KinesisVideoSignalingChannels.ClientConfiguration = {
    region: AwsConfig.region,
    endpoint: data.signalingData.endpointsByProtocol.HTTPS,
    correctClockSkew: true,
    credentials: {
      accessKeyId: awsCredentials.key,
      secretAccessKey: awsCredentials.secret,
    },
  };

  const kinesisVideoSignalingChannelsClient = new KinesisVideoSignalingChannels(
    config
  );

  const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
    .getIceServerConfig({
      ChannelARN: data.signalingData.arnChannel,
    })
    .promise();

  const iceServers: {
    urls: string[];
    username: string;
    credential: string;
  }[] = [];

  getIceServerConfigResponse?.IceServerList?.forEach((iceServer) => {
    if (!iceServer.Uris || !iceServer.Username || !iceServer.Password) {
      return;
    }
    iceServers.push({
      urls: iceServer.Uris,
      username: iceServer.Username,
      credential: iceServer.Password,
    });
  });

  return iceServers;
};
