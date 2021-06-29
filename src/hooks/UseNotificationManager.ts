import { createGlobalState } from 'react-hooks-global-state';
import { useCallback, useEffect } from "react";
import { useGlobalState } from "../state/GlobalState";
import { startSocketConnection } from "../request/socketClient";
import useAxios from "axios-hooks";

type NotificationState = {
  notifications: any[],
  acceptedInvitations: any[],  
  onInvitationAccepted?: (i: any) => void,
  onInvitationRejected?: (i: any) => void,
}
const InitialState = {
  notifications: [],
  acceptedInvitations: [],
  onInvitationAccepted: undefined,
  onInvitationRejected: undefined,
}
const { useGlobalState: useNotificationState } = createGlobalState<NotificationState>(InitialState);

export const UseNotificationManager = () => {
  const [notificationsArr, setNotifications] = useNotificationState('notifications');
  const [invitationAcceptedCb, setInvitationAcceptedCb] = useNotificationState('onInvitationAccepted');
  const [onInvitationRejected, setOnInvitationRejected] = useNotificationState('onInvitationRejected');
  const [acceptedInvitations, setAcceptedInvitations] = useNotificationState('acceptedInvitations');
  
  const [jwtToken] = useGlobalState('jwtToken')

  const [callTokenReq, request] = useAxios({
    method: 'GET',
  }, { manual: true })

  useEffect(() => {
    if (!jwtToken) return

    const socket = startSocketConnection()
    if (!socket?.hasListeners('NEW_VOICE_INVITATION')) {
      socket?.once("NEW_VOICE_INVITATION", onInvitationReceived)
    }
    if (!socket?.hasListeners('NEW_VIDEO_INVITATION')) {
      socket?.once("NEW_VIDEO_INVITATION", onInvitationReceived)
    }
  }, [jwtToken])

  useEffect(() => {
    const socket = startSocketConnection()
    if (invitationAcceptedCb && !socket?.hasListeners('INVITATION_ACCEPTED')) {
      socket?.once("INVITATION_ACCEPTED", onInvitationAccepted)
    }
  }, [invitationAcceptedCb])

  useEffect(() => {
    const socket = startSocketConnection()
    if (onInvitationRejected) {
      socket?.off("INVITATION_DECLINED", onInvitationRejected)
      socket?.once("INVITATION_DECLINED", onInvitationRejected)
    } else {
      socket?.off("INVITATION_DECLINED", removeNotification)
      socket?.once("INVITATION_DECLINED", removeNotification)
    }
  }, [onInvitationRejected, jwtToken])


  const onInvitationReceived = (i: any) => {
    setNotifications(p => ([...p, i]))
  }
  const onInvitationAccepted = useCallback((i: any) => {
    if (!i || invitationsIsAccepted(i) === true) return 

    removeNotification(i)
    invitationAcceptedCb && invitationAcceptedCb(i)
    setAcceptedInvitations(p => ([ ...p, i]))
  }, [invitationAcceptedCb])

  const removeNotification = (i: any) => {
    setNotifications(p => p.filter(a => a.id != i.id))
  }
  const invitationsIsAccepted = (a: any) => {
    return acceptedInvitations.find(i => i.id === a.id)
  }

  const acceptInvitation = ({ invitation }: any) => {
    return request({
      url: '/invitation/accept',
      method: 'post',
      data: { invitationId: invitation.id }
    })
      .then(() => removeNotification(invitation))
  }

  const rejectInvitation = ({ invitationId }: { invitationId: string }) => {
    return request({
      url: '/invitation/reject',
      method: 'post',
      data: { invitationId },
    })
      .then(() => removeNotification({ id: invitationId }))
  }

  return {
    notificationsArr,
    acceptInvitation,
    rejectInvitation,
    onInvitationAccepted: (cb: (i: any) => void) => {
      setInvitationAcceptedCb(() => () => cb)
    },
    onInvitationRejected: (cb: (i: any) => void) => {
      setOnInvitationRejected(() => () => cb)
    }
  }
}
