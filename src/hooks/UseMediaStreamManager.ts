import { useCallback } from "react"
import { createGlobalState } from "react-hooks-global-state";

type InitialState = {
  currentMediaStream: undefined | MediaStream,
  currentRemoteMediaStream: undefined | MediaStream,
  broadcasting: ('AUDIO' | 'VIDEO')[],
}
export const {
  useGlobalState: useMediaState,
  getGlobalState
} = createGlobalState<InitialState>({ currentMediaStream: undefined, currentRemoteMediaStream: undefined, broadcasting: [] });

const getNonMutedTracks = (tracks: MediaStreamTrack[]) => {
  return new Promise<MediaStreamTrack[]>((resolve, rejected) => {
    const isMuted = (t: MediaStreamTrack) => t.muted === true

    const inmutedTracks: MediaStreamTrack[] = [];
    const isAllMuted = tracks.every(isMuted)
    if (isAllMuted) {
      tracks.forEach(t => {
        t.onunmute = function () {
          inmutedTracks.push(this)
          if (inmutedTracks.length === tracks.length) {
            resolve(inmutedTracks)
            t.onunmute = null
          }
        }
      })
    } else {
      resolve(tracks.filter(t => !isMuted(t)))
    }
  })
}

export const UseMediaStreamManager = () => {
  const [currentMediaStream, setCurrentMediaStream] = useMediaState("currentMediaStream")
  const [, setCurrentRemoteMediaStream] = useMediaState("currentRemoteMediaStream")
  const [, setBroadcasting] = useMediaState("broadcasting")

  const getMediaStreams = () => {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((s) => {
        setBroadcasting(["VIDEO", "AUDIO"])
        setCurrentMediaStream(s)
        return s
      })
  }

  const stopAudio = useCallback(() => {
    currentMediaStream?.getAudioTracks()
      .forEach((t) => {
        currentMediaStream.removeTrack(t)
      })
  }, [currentMediaStream])

  const stopVideo = useCallback(() => {
    currentMediaStream?.getVideoTracks()
      .forEach((t) => {
        currentMediaStream.removeTrack(t)
      })
  }, [currentMediaStream])

  const isBroadcastingVideo = () => {
    return getGlobalState("broadcasting").find(e => e === 'VIDEO') !== undefined
  }

  const isBroadcastingAudio = () => {
    return getGlobalState("broadcasting").find(e => e === 'AUDIO') !== undefined
  }

  const getRemoteVideo = () => {
    const videoTracks = getGlobalState("currentRemoteMediaStream")
    ?.getVideoTracks()
    .filter(t => t.muted === false)

    return videoTracks || []
  }

  const getRemoteAudio = () => {
    const tracks = getGlobalState("currentRemoteMediaStream")
      ?.getAudioTracks() || [];

    return getNonMutedTracks(tracks)
  }

  const getRemoteTracks = () => {
    return getRemoteAudio()
      .then(audioTracks => {
        console.log({ audioTracks })
        return getRemoteVideo().concat(audioTracks)
      })
  }

  const stopVideoBroadcast = () => {
    setBroadcasting(p => [...p.filter(t => t !== "VIDEO")])
    getGlobalState("currentMediaStream")
      ?.getVideoTracks()
      .forEach(t => {
        t.enabled = false
      })
  }

  const stopAudioBroadcast = () => {
    setBroadcasting(p => [...p.filter(t => t !== "AUDIO")])
    getGlobalState("currentMediaStream")
      ?.getAudioTracks()
      .forEach(t => {
        t.enabled = false
      })
  }

  const shareVideo = () => {
    setBroadcasting(p => p.filter(t => t !== "VIDEO").concat(["VIDEO"]))
    getGlobalState("currentMediaStream")
      ?.getVideoTracks()
      .forEach(t => {
        t.enabled = true
      })
  }

  const shareAudio = () => {
    setBroadcasting(p => p.filter(t => t !== "AUDIO").concat(["AUDIO"]))
    getGlobalState("currentMediaStream")
      ?.getAudioTracks()
      .forEach(t => {
        t.enabled = true
      })
  }

  const getLocalVideo = () => {
    return getGlobalState("currentMediaStream")?.getVideoTracks()[0]
  }
  const getLocalAudio = () => {
    return getGlobalState("currentMediaStream")?.getVideoTracks()[0]
  }

  return {
    currentMediaStream: () => {
      return getGlobalState("currentMediaStream")
    },
    getCurrentRemoteMediaStream: () => {
      return getGlobalState("currentRemoteMediaStream")
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
    getMediaStreams,
  }
}
