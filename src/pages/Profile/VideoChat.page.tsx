import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/user_detail.css';
import '../../css/cover.css';
import '../../css/timeline.css';
import '../../css/Profile.css';
import ProfileHeader from './ProfileHeader';
import useAxios from 'axios-hooks'
import { Redirect, useParams } from 'react-router-dom';
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';
import GetUserAge from '../../utils/GetUserAge';
import IsOwnProfile from '../../utils/IsOwnProfile';
import { BrandColor } from '../../utils/Colors';
import { UseTwilioVideoCall } from '../../utils/UseTwilioVideoCall';
import SohoButton from '../../partials/SohoButton';
import { useGlobalState, userIsLogged } from '../../state/GlobalState';
import { UserData } from '../../types/UserData';
import UserIsLogged from '../../utils/UserIsLogged';

function VideoChat() {
    let { id } = useParams<{ id: string }>();
    const [userData] = useGlobalState("userData")
    const [redirect, setRedirect] = useState(false);
    const [user, setUser] = useState<UserData | undefined>();
    const [invitations, setInvitations] = useState<any[]>([]);

    const twilioVideo = UseTwilioVideoCall({ node: document.getElementById("video-window") })

    const [{ data, loading, error }, getUser] = useAxios<UserData>({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    useEffect(() => {
        setInterval(() => {
            refetchInvitations()
        }, 1000 * 15)
    }, [])

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    useEffect(() => {
        if (user && UserIsLogged() && IsOwnProfile({ user }) ) {
            refetchInvitations()
        }
    }, [user])

    const refetchInvitations = () => {
        return twilioVideo.getInvitations()
        .then((invitations) => {
            setInvitations(invitations)
        })
    }

    const isChatButtonDisabled = () => {
        return !user || !userData || user.isLogged == false
    }

    const getNonRejectedInvitations = (invitations: any[]) => {
        return invitations.filter(i => i.responseFromUser == "WAITING_RESPONSE")
    }

    if (redirect) {
        return <Redirect to="/profile-edit" />
    }

    if (user && !UserIsLogged()) {
        return <Redirect to={`/profile/${user.id}`} />
    }

    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader
                        user={user}
                        extraContent={
                            <>
                                {IsOwnProfile({ user }) && (
                                    <div style={{ position: 'absolute', right: 0, height: '100%' }}>
                                        <div className="upload-btn-wrapper" style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                                            <button style={{ padding: 5, fontSize: 18, alignSelf: "center" }} onClick={() => setRedirect(true)} className="btn">Edit</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        }
                    />
                </div>

                <div className="col-md-10 col-md-offset-1">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="widget">
                                <div className="widget-body">
                                    <div className="pic_pic_link">
                                        <ul>
                                            <li></li>
                                            {/*<li>
                                                {editing == false && <a onClick={() => setEditing(true)} href="#"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Edit</a>}
                                                {editing == true && (
                                                    <>
                                                        <a onClick={() => setEditing(false)} href="#"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Cancel</a>
                                                        <a onClick={() => setEditing(true)} href="#"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Save</a>
                                                    </>
                                                )}
                                                </li>*/}
                                        </ul>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 col-xs-12">
                                            {user && !IsOwnProfile({ user }) && (
                                                <div role="form">
                                                    <SohoButton
                                                        disabled={isChatButtonDisabled()}
                                                        value={"Start Video Chat"}
                                                        onClick={() => {
                                                            if (!userData || !user) return
                                                            const node = document.getElementById("video-window") as HTMLMediaElement

                                                            twilioVideo.initVideoCall({
                                                                identity: userData?.nickname,
                                                                divNode: node,
                                                                toUserNickname: user.nickname
                                                            })
                                                        }}
                                                    />
                                                    <SohoButton
                                                        disabled={!twilioVideo.isConnected}
                                                        value={"End Chat"}
                                                        onClick={() => {
                                                            twilioVideo.endCall()
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {invitations.length == 0 ? (
                                                <h4>No calls invitations</h4>
                                            ): (
                                                <>
                                                <h4>Chat invitations</h4>
                                                {getNonRejectedInvitations(invitations).length != 0 ? getNonRejectedInvitations(invitations).map((i) => {
                                                    return (
                                                        <div key={i.id} style={{ border: `1px solid ${BrandColor}`, borderRadius: '25px', marginBottom: '0.5rem' }}>
                                                            <div style={{ backgroundColor: BrandColor, padding: "1rem", borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                                                                <p style={{ color: 'white', margin: 0 }}>
                                                                    You have a video chat invitation from <b>{i.videoChat.createdBy.nickname}</b>
                                                                </p>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: "1rem" }}>
                                                                <SohoButton
                                                                    onClick={() => {
                                                                        if (!userData) return 
                                                                        const node = document.getElementById("video-window") as HTMLMediaElement

                                                                        twilioVideo.acceptInvitation({ invitation: i, user: userData, divNode: node })
                                                                        .then(() => refetchInvitations())
                                                                    }}
                                                                    value="Accept"
                                                                />
                                                                <SohoButton
                                                                    onClick={() => {
                                                                        twilioVideo.rejectInvitation({ invitationId: i.id })
                                                                        .then(() => refetchInvitations())
                                                                    }}
                                                                    value="Decline"
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                }): (
                                                    <>
                                                    <h4>No video chat invitations</h4>
                                                    </>
                                                )}
                                                </>
                                            )}
                                        </div>

                                        <div className="col-lg-8 col-md-8 col-xs-12">
                                            <div id="video-window" style={{ width: '100%'}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default VideoChat;