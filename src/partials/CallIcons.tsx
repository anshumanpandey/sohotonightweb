import React from 'react';
import { useHistory } from 'react-router-dom';
import { UsePeerCall } from '../hooks/UsePeerCall';
import { UsePeerVideo } from '../hooks/UsePeerVideoChat';
import { callStarted, showVideoChatModal, useGlobalState, userIsLogged } from '../state/GlobalState';
import SohoLink from './SohoLink';


export const CallIcons = ({ disabled = false, model, hideMessageIcon = false }: { disabled?: boolean, model: any, hideMessageIcon?: boolean }) => {
    let history = useHistory();
    let [userData] = useGlobalState('userData');

    const peerVideo = UsePeerVideo({})
    const call = UsePeerCall()

    return (<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
        <SohoLink
            onClick={() => {
                if (!userIsLogged()) {
                    history.push('/register')
                    return
                }
                if (userData?.tokensBalance == 0) {
                    history.push('/payment')
                    return
                }

                callStarted({ toModel: model })
                call.sendCallRequest({ toNickname: model.nickname })
            }}
            disabled={disabled}
            style={{ textAlign: 'end', width: '20%', marginBottom: 0, marginRight: '2rem' }}>
            <i style={{ fontSize: '2.5rem' }} className="fa fa-phone" aria-hidden="true"></i>
        </SohoLink>
        <SohoLink
            onClick={() => {
                if (!userIsLogged()) {
                    history.push('/register')
                    return
                }
                if (userData?.tokensBalance == 0) {
                    history.push('/payment')
                    return
                }
                peerVideo.sendRequest({ toUserNickname: model.nickname })
                    .then(() => showVideoChatModal())
            }}
            disabled={disabled}
            style={{ textAlign: 'end', width: '20%', marginBottom: 0, marginRight: '2rem' }}>
            <i style={{ fontSize: '2.5rem' }} className="fa fa-video-camera" aria-hidden="true"></i>
        </SohoLink>
        {hideMessageIcon === false && (
            <SohoLink
                onClick={() => {
                    history.push(`/messages?startWith=${model.id}`)
                }}
                disabled={disabled}
                style={{ textAlign: 'end', width: '20%', marginBottom: 0 }}>
                <i style={{ fontSize: '2.5rem' }} className="fa fa-comments" aria-hidden="true"></i>
            </SohoLink>
        )}
    </div>)
}