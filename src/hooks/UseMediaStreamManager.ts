export const UseMediaStreamManager = () => {
  const getMediaStreams = () => {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  }

  return {
    getMediaStreams
  }
}
