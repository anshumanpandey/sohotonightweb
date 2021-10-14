import { createGlobalState } from "react-hooks-global-state";
import { useCallback, useEffect } from "react";
import { useGlobalState } from "../state/GlobalState";
import { startSocketConnection } from "../request/socketClient";
import useAxios from "axios-hooks";

type NotificationState = {
  lastInvitationSended?: any;
  notifications: any[];
  acceptedInvitations: any[];
  onInvitationAccepted?: (i: any) => void;
  onInvitationRejected?: (i: any) => void;
};
const InitialState = {
  lastInvitationSended: undefined,
  notifications: [],
  acceptedInvitations: [],
  onInvitationAccepted: undefined,
  onInvitationRejected: undefined,
};
const {
  useGlobalState: useNotificationState,
  getGlobalState: getGlobalNotificationManagerState,
} = createGlobalState<NotificationState>(InitialState);

export const UseNotificationManager = () => {
  const [notificationsArr, setNotifications] =
    useNotificationState("notifications");
  const [, setLastInvitationSended] = useNotificationState(
    "lastInvitationSended"
  );
  const [invitationAcceptedCb, setInvitationAcceptedCb] = useNotificationState(
    "onInvitationAccepted"
  );
  const [onInvitationRejected, setOnInvitationRejected] = useNotificationState(
    "onInvitationRejected"
  );
  const [acceptedInvitations, setAcceptedInvitations] = useNotificationState(
    "acceptedInvitations"
  );

  const [jwtToken] = useGlobalState("jwtToken");

  const [callTokenReq, request] = useAxios(
    {
      method: "GET",
    },
    { manual: true }
  );

  useEffect(() => {
    if (!jwtToken) return;

    const socket = startSocketConnection();
    socket?.off("INVITATION_CANCELLED", onNotificationCancelled);
    socket?.once("INVITATION_CANCELLED", onNotificationCancelled);
    if (!socket?.hasListeners("NEW_VIDEO_INVITATION")) {
      socket?.once("NEW_VIDEO_INVITATION", onInvitationReceived);
    }
  }, [jwtToken]);

  useEffect(() => {
    const socket = startSocketConnection();
    if (invitationAcceptedCb && !socket?.hasListeners("INVITATION_ACCEPTED")) {
      socket?.once("INVITATION_ACCEPTED", onInvitationAccepted);
    }
  }, [invitationAcceptedCb]);

  useEffect(() => {
    const socket = startSocketConnection();
    socket?.off("INVITATION_DECLINED", onInvitationDeclined);
    socket?.once("INVITATION_DECLINED", onInvitationDeclined);
  }, [onInvitationRejected, jwtToken]);

  const onNotificationCancelled = (i: any) => {
    const invitationId = getGlobalNotificationManagerState(
      "lastInvitationSended"
    )?.id;
    if (invitationId) {
      setLastInvitationSended(undefined);
    }
    removeNotification(i);
  };

  const onInvitationDeclined = (i: any) => {
    const invitationId = getGlobalNotificationManagerState(
      "lastInvitationSended"
    )?.id;
    if (invitationId) {
      setLastInvitationSended(undefined);
    }
    if (onInvitationRejected) {
      onInvitationRejected(i);
    }
    removeNotification(i);
  };

  const onInvitationReceived = (i: any) => {
    setNotifications((p) => [...p, i]);
  };
  const onInvitationAccepted = useCallback(
    (i: any) => {
      if (!i || invitationsIsAccepted(i) === true) return;

      removeNotification(i);
      invitationAcceptedCb && invitationAcceptedCb(i);
      setAcceptedInvitations((p) => [...p, i]);
    },
    [invitationAcceptedCb]
  );

  const removeNotification = (i: any) => {
    setNotifications((p) => p.filter((a) => a.id != i.id));
  };
  const invitationsIsAccepted = (a: any) => {
    return acceptedInvitations.find((i) => i.id === a.id);
  };

  const sendInvitation = ({
    toUserNickname,
    startWithVoice = false,
  }: {
    toUserNickname: string;
    startWithVoice?: boolean;
  }) => {
    return request({
      url: "/video/create",
      method: "post",
      data: {
        toUserNickname,
        startWithVoice,
      },
      validateStatus: (httpCode) => httpCode === 409 || httpCode === 200,
    }).then((r) => {
      setLastInvitationSended(r.data);
      return r;
    });
  };

  const acceptInvitation = ({ invitation }: any) => {
    return request({
      url: "/invitation/accept",
      method: "post",
      data: { invitationId: invitation.id },
    }).then(() => removeNotification(invitation));
  };

  const rejectInvitation = ({ invitationId }: { invitationId: string }) => {
    return request({
      url: "/invitation/reject",
      method: "post",
      data: { invitationId },
    }).then(() => removeNotification({ id: invitationId }));
  };

  const cancelNotification = () => {
    const invitationId = getGlobalNotificationManagerState(
      "lastInvitationSended"
    )?.id;
    if (!invitationId) return;

    return request({
      url: "/invitation/cancel",
      method: "post",
      data: { invitationId },
    })
      .then(() => removeNotification({ id: invitationId }))
      .then(() => window.location.reload());
  };

  return {
    notificationsArr,
    invitationRequest: callTokenReq,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    cancelNotification,
    onInvitationAccepted: (cb: (i: any) => void) => {
      setInvitationAcceptedCb(() => () => cb);
    },
    onInvitationRejected: (cb: (i: any) => void) => {
      setOnInvitationRejected(() => () => cb);
    },
  };
};
