import React from "react";
import { UsePeerVideo, useVideoState } from "../hooks/UsePeerVideoChat";
import { BrandColor } from "../utils/Colors";
import SohoModal from "./SohoModal";
import { UseNotificationManager } from "../hooks/UseNotificationManager";

const SohoVideoModal: React.FC = () => {
  const [currentVideoChat, setCurrentVideoChat] =
    useVideoState("currentVideoChat");
  const { cancelNotification } = UseNotificationManager();

  const videoPeer = UsePeerVideo({
    parentNode: document.getElementById("video-div") as HTMLElement,
  });

  let iconBaseStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    padding: "0.5rem",
    cursor: "pointer",
    color: BrandColor,
  };
  let videIconStyles: React.CSSProperties = iconBaseStyle;
  let audioIconStyles: React.CSSProperties = iconBaseStyle;
  if (videoPeer.isBroadcastingVideo === false) {
    videIconStyles = {
      ...iconBaseStyle,
      color: "black",
      background: "#00000080",
      borderRadius: "50%",
      opacity: 0.5,
    };
  }
  if (videoPeer.isBroadcastingAudio === false) {
    audioIconStyles = {
      ...iconBaseStyle,
      color: "black",
      background: "#00000080",
      borderRadius: "50%",
      opacity: 0.5,
    };
  }

  const endCall = () => videoPeer.endCall(currentVideoChat);

  const closeCallback = () => {
    setCurrentVideoChat(null);
    console.log({ isOnCall: videoPeer.isOnCall });
    return videoPeer.isOnCall ? endCall() : cancelNotification();
  };

  return (
    <SohoModal
      closeOnBackdropClik={false}
      size={"lg"}
      onClose={closeCallback}
      show={currentVideoChat != null}
      title="Connected..."
      footer={() => {
        return (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <i
              onClick={
                videoPeer.isBroadcastingAudio
                  ? videoPeer.muteMyself
                  : videoPeer.shareAudio
              }
              style={audioIconStyles}
              className={`fa fa-microphone`}
              aria-hidden="true"
            ></i>
            <i
              onClick={
                videoPeer.isBroadcastingVideo
                  ? videoPeer.stopMyVideo
                  : videoPeer.shareVideo
              }
              style={videIconStyles}
              className="fa fa-video-camera"
              aria-hidden="true"
            ></i>
            <i
              onClick={
                videoPeer.isBroadcastingAudio
                  ? videoPeer.requestFullScreen
                  : undefined
              }
              style={videIconStyles}
              className={`fa fa-expand`}
              aria-hidden="true"
            ></i>
            <i
              onClick={closeCallback}
              style={iconBaseStyle}
              className={`fa fa-window-close`}
              aria-hidden="true"
            ></i>
          </div>
        );
      }}
    >
      <div
        id="video-div"
        className="embed-responsive embed-responsive-16by9"
      ></div>
    </SohoModal>
  );
};
export default SohoVideoModal;
