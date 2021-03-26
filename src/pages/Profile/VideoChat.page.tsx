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
import { UsePeerVideo } from '../../hooks/UsePeerVideoChat';
import { SohoAlert } from '../../partials/SohoAlert';

function VideoChat() {
    let { id, acceptedInvitationId } = useParams<{ id: string, acceptedInvitationId?: string }>();
    const [userData] = useGlobalState("userData")
    const [redirect, setRedirect] = useState(false);
    const [user, setUser] = useState<UserData | undefined>();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [isAcceptingInvitation, setIsAcceptingInvitation] = useState<boolean>(false);

    const peerVideo = UsePeerVideo({ parentNode: document.getElementById("video-window") as HTMLElement })

    const [{ data, loading, error }, getUser] = useAxios<UserData>({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    useEffect(() => {
        refetchInvitations()
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    useEffect(() => {
        if (acceptedInvitationId) {
            const found = invitations.find(i => i.id == acceptedInvitationId)
            if (found) {
                if (!userData) return

                setIsAcceptingInvitation(true)
                peerVideo.acceptInvitation({ invitation: found })
                    .then(() => setIsAcceptingInvitation(true))
                    .then(() => refetchInvitations())
            }

        }
    }, [acceptedInvitationId, invitations, userData])

    useEffect(() => {
        if (user && UserIsLogged() && IsOwnProfile({ user })) {
            peerVideo.onInvitationReceived((i) => {
                setInvitations(p => [i, ...p])
            })
        }
    }, [user])

    const refetchInvitations = () => {
        return peerVideo.getInvitations()
            .then((invitations) => {
                setInvitations(() => [...invitations])
            })
    }

    const isChatButtonDisabled = () => {
        return !user || !userData || user.isLogged == false || peerVideo.canStartChat === false
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
                                        {user && !IsOwnProfile({ user }) && (
                                            <div className="col-md-3 col-xs-12">
                                                <div role="form">
                                                    <SohoButton
                                                        disabled={isChatButtonDisabled()}
                                                        value={"Start Video Chat"}
                                                        onClick={() => {
                                                            if (!user) return

                                                            peerVideo.sendRequest({ toUserNickname: user.nickname })
                                                        }}
                                                    />
                                                    <SohoButton
                                                        value={"End Chat"}
                                                        onClick={() => {
                                                            peerVideo.endCall(peerVideo.currentVideoChat)
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        )}
                                        
                                        <div className={`col-lg-${user && !IsOwnProfile({ user }) ? '9': '12'} col-md-${user && !IsOwnProfile({ user }) ? '9': '12'} col-xs-12`}>
                                            <div id="video-window" style={{ width: '100%' }}></div>
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