import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SohoLink from '../../partials/SohoLink';
import { callStarted, setDevice, updateCallStatus, useGlobalState } from '../../state/GlobalState';
import GetUserAge from '../../utils/GetUserAge';
import UseIsMobile from '../../utils/UseIsMobile';
import { UseTwilioVoiceCall } from '../../utils/UseTwilioVoiceCall';

const ListPostItem = ({ girl: g, callToken } : { girl: any, callToken?: string }) => {
    const isMobile = UseIsMobile();
    const call = UseTwilioVoiceCall()
    const [userData] = useGlobalState("userData");

    const callIsDisabled = () => {
        if (!g) return true
        if (g.isLogged === false) return true

        if (callToken === undefined) return true

        if (!userData) return true
        if (userData.tokensBalance === 0) return true

        return false
    }

    useEffect(() => {
        call.onStatusChange(updateCallStatus)
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', borderBottom: "1px solid #d8d8d8" }}>
            <div style={{ flex: 1,paddingLeft: 0, paddingTop: '2rem', paddingBottom: '2rem', paddingRight: '2rem' }}>
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
            <div style={{ width: isMobile ? '70%': '75%', paddingTop: '2rem', display: 'flex', flexDirection: isMobile ? 'column': 'row' }}>
                <div style={{ width: '100%' }}>
                    <Link style={{ marginBottom: '10px', fontSize: 15, display: 'inline-block', color: 'black', fontWeight: 'bold' }} to={`/profile/${g.id}`}>
                        {g.nickname}
                    </Link>
                    <p>{g.orientation} {GetUserAge(g)} year old {g.gender}</p>
                    {g.aboutYouDetail && <p style={{ wordWrap: "break-word" }}>{g.aboutYouDetail}</p>}
                </div>
                <div style={{ width: '100%' }}>
                    {g.callNumber && (
                        <div>
                            <p style={{ fontFamily: 'AeroliteItalic', fontSize: 16, textAlign: isMobile ? "start":"end" }}>Call me now for one to one live chat: </p>
                            <SohoLink
                                onClick={() => {
                                    if (callToken) {
                                        callStarted()
                                        call.requestCallTo({ toNickname: g.nickname })
                                    }
                                }}
                                disabled={callIsDisabled()}
                                style={{ textAlign: 'end' }}>
                                {g.callNumber}
                            </SohoLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListPostItem;
