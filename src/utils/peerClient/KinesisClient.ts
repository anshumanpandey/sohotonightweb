import { Role, SignalingClient } from "amazon-kinesis-video-streams-webrtc";
import { KinesisVideo, KinesisVideoSignalingChannels } from "aws-sdk";
import { getAwsCredentials } from "../AwsClient";

const KinesisConfig = {
  region: "us-east-2",
};

export const setupKinesis = async (params: {
  role: Role;
  channelUuid: string;
  clientUserId: string;
}) => {
  const credentials = await getAwsCredentials();
  const kinesisVideoClient = new KinesisVideo({
    region: KinesisConfig.region,
    accessKeyId: credentials.key,
    secretAccessKey: credentials.secret,
    correctClockSkew: true,
  });

  // Get signaling channel ARN
  const describeSignalingChannelResponse = await kinesisVideoClient
    .describeSignalingChannel({
      ChannelName: params.channelUuid,
    })
    .promise();
  const channelARN = describeSignalingChannelResponse?.ChannelInfo?.ChannelARN;
  console.log("[MASTER] Channel ARN: ", channelARN);
  if (!channelARN) return false;

  // Get signaling channel endpoints
  const getSignalingChannelEndpointResponse = await kinesisVideoClient
    .getSignalingChannelEndpoint({
      ChannelARN: channelARN || "",
      SingleMasterChannelEndpointConfiguration: {
        Protocols: ["WSS", "HTTPS"],
        Role: params.role,
      },
    })
    .promise();
  const endpointsByProtocol =
    getSignalingChannelEndpointResponse?.ResourceEndpointList?.reduce(
      (endpoints: Record<string, string>, endpoint) => {
        const a = endpoint?.Protocol;
        if (!a) return endpoints;
        if (!endpoint.ResourceEndpoint) return endpoints;

        endpoints[a] = endpoint.ResourceEndpoint;
        return endpoints;
      },
      {}
    );
  console.log("[MASTER] Endpoints: ", endpointsByProtocol);
  const signalingClient = new SignalingClient({
    channelARN: channelARN || "",
    channelEndpoint: endpointsByProtocol?.WSS || "",
    role: params.role,
    clientId: params.role === Role.VIEWER ? params.clientUserId : undefined,
    region: KinesisConfig.region,
    credentials: {
      accessKeyId: credentials.key,
      secretAccessKey: credentials.secret,
    },
    systemClockOffset: kinesisVideoClient.config.systemClockOffset,
  });

  // Get ICE server configuration
  const kinesisVideoSignalingChannelsClient = new KinesisVideoSignalingChannels(
    {
      region: KinesisConfig.region,
      accessKeyId: credentials.key,
      secretAccessKey: credentials.secret,
      endpoint: endpointsByProtocol?.HTTPS,
      correctClockSkew: true,
    }
  );
  const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
    .getIceServerConfig({
      ChannelARN: channelARN || "",
    })
    .promise();
  const iceServers = [];
  iceServers.push({
    urls: `stun:stun.kinesisvideo.${KinesisConfig.region}.amazonaws.com:443`,
  });
  getIceServerConfigResponse.IceServerList?.forEach((iceServer) =>
    iceServers.push({
      urls: iceServer.Uris,
      username: iceServer.Username,
      credential: iceServer.Password,
    })
  );
  console.log("[MASTER] ICE servers: ", iceServers);

  const peerConfig = {
    iceServers,
  };

  return {
    signalingClient,
    peerConfig,
  };
};

export default KinesisConfig;
