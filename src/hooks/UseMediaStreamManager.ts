import { useCallback, useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import SimplePeer from "simple-peer";
var DetectRTC = require("detectrtc");

enum BroadcastTypes {
  "AUDIO",
  "VIDEO",
}

type OnTrackAddedCb = (t: MediaStreamTrack) => void;

type InitialState = {
  currentMediaStream: undefined | MediaStream;
  currentRemoteMediaStream: undefined | MediaStream;
  broadcasting: BroadcastTypes[];
  requestedTracks: BroadcastTypes[];
  onTrackAddedCb: OnTrackAddedCb | undefined;
};
export const { useGlobalState: useMediaState, getGlobalState } =
  createGlobalState<InitialState>({
    currentMediaStream: undefined,
    currentRemoteMediaStream: undefined,
    broadcasting: [],
    requestedTracks: [],
    onTrackAddedCb: undefined,
  });

const getNonMutedTracks = (tracks: MediaStreamTrack[]) => {
  return new Promise<MediaStreamTrack[]>((resolve, rejected) => {
    const isMuted = (t: MediaStreamTrack) => t.muted === true;

    const inmutedTracks: MediaStreamTrack[] = [];
    const isAllMuted = tracks.every(isMuted);
    if (isAllMuted) {
      const expiryTicker = setTimeout(() => {
        tracks.forEach((t) => {
          t.onunmute = function () {
            console.log("unmuted", this);
          };
        });
        resolve([]);
      }, 1000);
      tracks.forEach((t) => {
        t.onunmute = function () {
          inmutedTracks.push(this);
          if (inmutedTracks.length === tracks.length) {
            clearTimeout(expiryTicker);
            resolve(inmutedTracks);
            t.onunmute = null;
          }
        };
      });
    } else {
      resolve(tracks.filter((t) => !isMuted(t)));
    }
  });
};

export const UseMediaStreamManager = () => {
  const [currentMediaStream, setCurrentMediaStream] =
    useMediaState("currentMediaStream");
  const [, setCurrentRemoteMediaStream] = useMediaState(
    "currentRemoteMediaStream"
  );
  const [, setBroadcasting] = useMediaState("broadcasting");
  const [, setRequestedTracks] = useMediaState("requestedTracks");
  const [, setOnTrackAddedCb] = useMediaState("onTrackAddedCb");

  const remoteStream = getGlobalState("currentRemoteMediaStream");
  const onTrackAddedCb = getGlobalState("onTrackAddedCb");

  useEffect(() => {
    if (!remoteStream) return;
    remoteStream.onaddtrack = (ev) => {
      const cb = getGlobalState("onTrackAddedCb");
      if (ev.track && cb) {
        cb(ev.track);
      }
    };
  }, [remoteStream, onTrackAddedCb]);

  const getAvailableDevices = () => {
    return new Promise<{ webcam: boolean; microphone: boolean }>((resolve) => {
      DetectRTC.load(() => {
        resolve({
          webcam: DetectRTC.hasWebcam,
          microphone: DetectRTC.hasMicrophone,
        });
      });
    });
  };

  const getMediaStreams = (p?: {
    ignoreAudio?: boolean;
    ignoreVideo?: boolean;
  }) => {
    const constraints: MediaStreamConstraints = { video: true, audio: true };
    if (p?.ignoreAudio === true) {
      //constraints.audio = false
    }
    if (p?.ignoreVideo === true) {
      //constraints.video = false
    }
    return navigator.mediaDevices.getUserMedia(constraints).then((s) => {
      const types = ([] as BroadcastTypes[])
        .concat(constraints.video === false ? [] : [BroadcastTypes.VIDEO])
        .concat(constraints.audio === false ? [] : [BroadcastTypes.AUDIO]);
      setBroadcasting(types);
      setRequestedTracks(types);
      setCurrentMediaStream(s);
      return s;
    });
  };

  const hasRequestedVideo = () => {
    return (
      getGlobalState("requestedTracks").find(
        (i) => i === BroadcastTypes.VIDEO
      ) !== undefined
    );
  };

  const stopAudio = useCallback(() => {
    currentMediaStream?.getAudioTracks().forEach((t) => {
      currentMediaStream.removeTrack(t);
    });
  }, [currentMediaStream]);

  const stopVideo = useCallback(() => {
    currentMediaStream?.getVideoTracks().forEach((t) => {
      currentMediaStream.removeTrack(t);
    });
  }, [currentMediaStream]);

  const isBroadcastingVideo = () => {
    return (
      getGlobalState("broadcasting").find((e) => e === BroadcastTypes.VIDEO) !==
      undefined
    );
  };

  const isBroadcastingAudio = () => {
    return (
      getGlobalState("broadcasting").find((e) => e === BroadcastTypes.AUDIO) !==
      undefined
    );
  };

  const getRemoteVideo = () => {
    const videoTracks =
      getGlobalState("currentRemoteMediaStream")?.getVideoTracks() || [];

    return videoTracks;
  };

  const getRemoteAudio = () => {
    const tracks =
      getGlobalState("currentRemoteMediaStream")?.getAudioTracks() || [];

    return getNonMutedTracks(tracks);
  };

  const getRemoteTracks = () => {
    return getRemoteAudio().then((audioTracks) => {
      return getRemoteVideo().concat(audioTracks);
    });
  };

  const stopVideoBroadcast = () => {
    setBroadcasting((p) => [...p.filter((t) => t !== BroadcastTypes.VIDEO)]);
    getGlobalState("currentMediaStream")
      ?.getVideoTracks()
      .forEach((t) => {
        t.enabled = false;
      });
  };

  const stopAudioBroadcast = () => {
    setBroadcasting((p) => [...p.filter((t) => t !== BroadcastTypes.AUDIO)]);
    getGlobalState("currentMediaStream")
      ?.getAudioTracks()
      .forEach((t) => {
        t.enabled = false;
      });
  };

  const shareVideo = ({ peer }: { peer?: SimplePeer.Instance }) => {
    setBroadcasting((p) =>
      p.filter((t) => t !== BroadcastTypes.VIDEO).concat([BroadcastTypes.VIDEO])
    );
    const localStream = getGlobalState("currentMediaStream");
    if (!localStream) return;

    if (hasRequestedVideo() === false) {
      return navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => stream.getVideoTracks())
        .then((videoTracks) => {
          videoTracks.forEach((t) => {
            localStream.addTrack(t);
            peer?.addTrack(t, localStream);
          });
        })
        .then(() => setRequestedTracks((p) => [...p, BroadcastTypes.VIDEO]))
        .then(() => localStream);
    } else {
      localStream.getVideoTracks().forEach((t) => {
        t.enabled = true;
      });
      return Promise.resolve(localStream);
    }
  };

  const shareAudio = () => {
    setBroadcasting((p) =>
      p.filter((t) => t !== BroadcastTypes.AUDIO).concat([BroadcastTypes.AUDIO])
    );
    getGlobalState("currentMediaStream")
      ?.getAudioTracks()
      .forEach((t) => {
        t.enabled = true;
      });
  };

  const getLocalVideo = () => {
    return getGlobalState("currentMediaStream")?.getVideoTracks()[0];
  };
  const getLocalAudio = () => {
    return getGlobalState("currentMediaStream")?.getVideoTracks()[0];
  };

  return {
    currentMediaStream: () => {
      return getGlobalState("currentMediaStream");
    },
    getCurrentRemoteMediaStream: () => {
      return getGlobalState("currentRemoteMediaStream");
    },
    getLocalVideo,
    getLocalAudio,
    getRemoteTracks,
    setCurrentRemoteMediaStream,
    isBroadcastingVideo,
    isBroadcastingAudio,
    getRemoteAudio,
    getRemoteVideo,
    stopVideoBroadcast,
    stopAudioBroadcast,
    stopAudio,
    shareVideo,
    shareAudio,
    stopVideo,
    getAvailableDevices,
    getMediaStreams,
    onTrackAdded: (cb: OnTrackAddedCb) => {
      setOnTrackAddedCb(() => cb);
    },
  };
};
