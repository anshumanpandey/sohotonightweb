import { createGlobalState } from 'react-hooks-global-state';
import { useCallback, useEffect } from "react";
import { useGlobalState } from "../state/GlobalState";
import { startSocketConnection } from "../request/socketClient";
import useAxios from "axios-hooks";

type NotificationState = {
  notifications: any[],
  acceptedInvitations: any[],  
  onInvitationAccepted?: (i: any) => void,
}
const InitialState = {
  notifications: [],
  acceptedInvitations: [],
  onInvitationAccepted: undefined,
}
const { useGlobalState: useNotificationState } = createGlobalState<NotificationState>(InitialState);

export const UseNotificationManager = () => {
  const [notificationsArr, setNotifications] = useNotificationState('notifications');
  const [invitationAcceptedCb, setInvitationAcceptedCb] = useNotificationState('onInvitationAccepted');
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
    socket?.once("INVITATION_DECLINED", removeNotification)
  }, [jwtToken])

  useEffect(() => {
    const socket = startSocketConnection()
    console.log(invitationAcceptedCb)
    if (invitationAcceptedCb && !socket?.hasListeners('INVITATION_ACCEPTED')) {
      socket?.once("INVITATION_ACCEPTED", onInvitationAccepted)
    }
  }, [invitationAcceptedCb])  

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
  }

  const onInvitationAcceptedListener = (cb: (i: any) => void) => {
    setInvitationAcceptedCb(() => () => cb)
  }

  return {
    notificationsArr,
    acceptInvitation,
    rejectInvitation,
    onInvitationAccepted: onInvitationAcceptedListener
  }
}
