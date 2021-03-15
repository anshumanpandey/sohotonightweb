import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SohoLink from '../../partials/SohoLink';
import { callStarted, updateCallStatus } from '../../state/GlobalState';
import GetUserAge from '../../utils/GetUserAge';
import UseIsMobile from '../../utils/UseIsMobile';
import { UseTwilioVoiceCall } from '../../utils/UseTwilioVoiceCall';

const ListPostItem = ({ girl: g, callToken } : { girl: any, callToken?: string }) => {
    const isMobile = UseIsMobile();
    const call = UseTwilioVoiceCall()

    useEffect(() => {
        call.onStatusChange(updateCallStatus)
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', borderBottom: "1px solid #d8d8d8" }}>
            <div style={{ flex: 1,paddingLeft: 0, paddingTop: '2rem', paddingBottom: '2rem', paddingRight: '2rem' }}>
                <Link style={{ display: "flex", justifyContent: "center" }} to={`/profile/${g.id}`}>
                    <img style={{ borderRadius: "50%", maxWidth: "100%", maxHeight: 100, minHeight: 100 }} src={g.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="img-responsive" alt="profile" />
                </Link>
                <div style={{ alignItems: "center", flex: 1, display: "flex", justifyContent: "center" }}>
                    {g?.isLogged ? (
                        <>
                            <i style={{ color: 'green', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                            <p style={{ fontSize: 15, color: 'green', margin: 0 }}>Online</p>
                        </>
                    ) : (
                        <>
                            <i style={{ color: 'gray', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                            <p style={{ fontSize: 15, color: 'gray', margin: 0 }}>Offline</p>
                        </>
                    )}
                </div>
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
                                        call.requestCallTo({ identity: g.nickname, token: callToken })
                                    }
                                }}
                                disabled={!g?.isLogged || !callToken }
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
