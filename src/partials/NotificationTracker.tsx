import useAxios from "axios-hooks";
import React, { useState } from "react";
import { UsePeerVideo } from "../hooks/UsePeerVideoChat";
import { showVideoChatModal, useGlobalState } from "../state/GlobalState";
import { SohoAlert } from "./SohoAlert";
import { UseNotificationManager } from "../hooks/UseNotificationManager";
import { useEffect } from "react";
import UseIsMobile from "../utils/UseIsMobile";

const isVideoChat = (i: any) => {
  return i.videoChat;
};

const NotificationTracker: React.FC = () => {
  const [userData] = useGlobalState("userData");
  const [rejectingVideoChat, setRejectingVideoChat] = useState<boolean>(false);
  const isMobile = UseIsMobile();
  const peerVideo = UsePeerVideo({});
  const {
    notificationsArr,
    rejectInvitation,
    acceptInvitation,
    onInvitationAccepted,
  } = UseNotificationManager();

  const [callTokenReq] = useAxios(
    {
      method: "GET",
      url: "/call/invitations",
    },
    { manual: true }
  );

  useEffect(() => {
    onInvitationAccepted((i) => {
      if (i && isVideoChat(i)) {
        peerVideo.onInvitationAccepted(i);
      }
    });
  }, [userData]);

  const notificationIsBusy = () => {
    return callTokenReq.loading === true || rejectingVideoChat === true;
  };

  return (
    <>
      {notificationsArr
        .filter((i) => i.responseFromUser === "WAITING_RESPONSE")
        .map((i, idx) => {
          let notificationBody = `${i.createdBy.nickname} is calling you`;
          return (
            <div
              key={i.id}
              style={{
                zIndex: 200,
                position: "fixed",
                left: "50%",
                transform: "translateX(-50%)",
                minWidth: isMobile ? "55vw" : "25%",
                maxWidth: "50vw",
                top: `${15 + idx * 15}vh`,
              }}
            >
              <SohoAlert
                autoCloseOnSeconds={15}
                busy={notificationIsBusy()}
                body={() => notificationBody}
                onAccept={() => {
                  Promise.resolve(showVideoChatModal())
                    .then(() => acceptInvitation({ invitation: i }))
                    .then((i) => peerVideo.acceptInvitation({ invitation: i }));
                }}
                onClose={() => {
                  setRejectingVideoChat(true);
                  rejectInvitation({ invitationId: i.id }).then(() => {
                    setRejectingVideoChat(false);
                    window.location.reload();
                  });
                }}
              />
            </div>
          );
        })}
    </>
  );
};
export default NotificationTracker;
