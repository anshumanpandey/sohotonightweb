import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UsePeerVideo } from "../hooks/UsePeerVideoChat";
import {
  showVideoChatModal,
  useGlobalState,
  userIsLogged,
} from "../state/GlobalState";
import SohoLink from "./SohoLink";

export const CallIcons = ({
  disabled: disabledProp = false,
  model,
  hideMessageIcon = false,
}: {
  disabled?: boolean;
  model: any;
  hideMessageIcon?: boolean;
}) => {
  const [isDisabled, setIsDisabled] = useState(disabledProp);
  let history = useHistory();
  let [userData] = useGlobalState("userData");

  const peerVideo = UsePeerVideo({});

  useEffect(() => {
    setIsDisabled(disabledProp);
  }, [disabledProp]);

  useEffect(() => {
    if (disabledProp !== true) {
      setIsDisabled(peerVideo.invitationRequest.loading);
    }
  }, [peerVideo.invitationRequest, disabledProp]);

  return (
    <div
      style={{ display: "flex", flexDirection: "row", justifyContent: "end" }}
    >
      <SohoLink
        onClick={() => {
          if (!userIsLogged()) {
            history.push("/register");
            return;
          }
          if (userData?.tokensBalance == 0) {
            history.push("/payment");
            return;
          }

          peerVideo
            .sendRequest({
              toUserNickname: model.nickname,
              startWithVoice: true,
            })
            .then(() => showVideoChatModal());
        }}
        disabled={isDisabled}
        style={{
          textAlign: "end",
          width: "20%",
          marginBottom: 0,
          marginRight: "2rem",
        }}
      >
        <i
          style={{ fontSize: "2.5rem" }}
          className="fa fa-phone"
          aria-hidden="true"
        ></i>
      </SohoLink>
      <SohoLink
        onClick={() => {
          if (!userIsLogged()) {
            history.push("/register");
            return;
          }
          if (userData?.tokensBalance == 0) {
            history.push("/payment");
            return;
          }
          peerVideo
            .sendRequest({ toUserNickname: model.nickname })
            .then(() => showVideoChatModal());
        }}
        disabled={isDisabled}
        style={{
          textAlign: "end",
          width: "20%",
          marginBottom: 0,
          marginRight: "2rem",
        }}
      >
        <i
          style={{ fontSize: "2.5rem" }}
          className="fa fa-video-camera"
          aria-hidden="true"
        ></i>
      </SohoLink>
      {hideMessageIcon === false && (
        <SohoLink
          onClick={() => {
            if (!userIsLogged()) {
              history.push("/register");
              return;
            }
            history.push(`/messages?startWith=${model.id}`);
          }}
          disabled={isDisabled}
          style={{ textAlign: "end", width: "20%", marginBottom: 0 }}
        >
          <i
            style={{ fontSize: "2.5rem" }}
            className="fa fa-comments"
            aria-hidden="true"
          ></i>
        </SohoLink>
      )}
    </div>
  );
};
