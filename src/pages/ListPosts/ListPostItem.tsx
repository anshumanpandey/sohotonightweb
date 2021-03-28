import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UsePeerCall } from '../../hooks/UsePeerCall';
import { UsePeerVideo } from '../../hooks/UsePeerVideoChat';
import SohoLink from '../../partials/SohoLink';
import { callStarted, updateCallStatus, useGlobalState, userIsLogged } from '../../state/GlobalState';
import GetUserAge from '../../utils/GetUserAge';
import UseIsMobile from '../../utils/UseIsMobile';

const ListPostItem = ({ girl: g }: { girl: any }) => {
    const peerVideo = UsePeerVideo({ })
    let history = useHistory();

    const isMobile = UseIsMobile();
    const call = UsePeerCall()
    const [userData] = useGlobalState("userData");

    const callIsDisabled = () => {
        if (!g) return true
        if (g.isLogged === false) return true

        if (!userData) return true
        if (userData.tokensBalance === 0) return true

        return false
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', borderBottom: "1px solid #d8d8d8" }}>
            <div style={{ flex: 1, paddingLeft: 0, paddingTop: '2rem', paddingBottom: '2rem', paddingRight: '2rem' }}>
                <Link style={{ display: "flex", justifyContent: "center", position: 'relative' }} to={`/profile/${g.id}`}>
                    <img style={{ borderRadius: "50%", maxWidth: "100%", maxHeight: 100, minHeight: 100 }} src={g.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="img-responsive" alt="profile" />
                    <div style={{ alignItems: "center", flex: 1, display: "flex", justifyContent: "center", position: 'absolute', bottom: '10%', right: '20%' }}>
                        {g?.isLogged ? (
                            <>
                                <i style={{ color: 'green', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                            </>
                        ) : (
                            <>
                                <i style={{ color: 'gray', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                            </>
                        )}
                    </div>
                </Link>
            </div>
            <div style={{ width: isMobile ? '70%' : '75%', paddingTop: '2rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                <div style={{ width: '100%' }}>
                    <Link style={{ marginBottom: '10px', fontSize: 15, display: 'inline-block', color: 'black', fontWeight: 'bold' }} to={`/profile/${g.id}`}>
                        {g.nickname}
                    </Link>
                    <p>{g.orientation} {GetUserAge(g)} year old {g.gender}</p>
                    {g.aboutYouDetail && <p style={{ wordWrap: "break-word" }}>{g.aboutYouDetail}</p>}
                </div>
                <div style={{ width: '100%' }}>
                    <div>
                        <p style={{ fontFamily: 'AeroliteItalic', fontSize: 16, textAlign: isMobile ? "start":"end" }}>Call me now for one to one live chat: </p>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                            <SohoLink
                                onClick={() => {
                                    if (!userIsLogged()) {
                                        history.push('/register')
                                        return
                                    }
                                    callStarted()
                                    call.sendCallRequest({ toNickname: g.nickname })
                                }}
                                disabled={callIsDisabled()}
                                style={{ textAlign: 'end', width: '20%' }}>
                                <i style={{ fontSize: '2.5rem' }} className="fa fa-phone" aria-hidden="true"></i>
                            </SohoLink>
                            <SohoLink
                                onClick={() => {
                                    if (!userIsLogged()) {
                                        history.push('/register')
                                        return
                                    }
                                    peerVideo.sendRequest({ toUserNickname: g.nickname })
                                    .then(() => history.push(`/video-chat/${g.id}`))
                                }}
                                disabled={callIsDisabled()}
                                style={{ textAlign: 'end', width: '20%' }}>
                                <i style={{ fontSize: '2.5rem' }} className="fa fa-video-camera" aria-hidden="true"></i>
                            </SohoLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListPostItem;
