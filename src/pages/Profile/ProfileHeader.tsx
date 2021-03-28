import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import cover from '../../img/Cover/profile-cover.jpg';
import '../../css/cover.css';
import { BrandColor } from '../../utils/Colors';
import { useGlobalState } from '../../state/GlobalState';
import IsOwnProfile from '../../utils/IsOwnProfile';
import UseIsMobile from '../../utils/UseIsMobile';
import UserIsLogged from '../../utils/UserIsLogged';
import UserLoggedIsModel from '../../utils/UserLoggedIsModel';
import { CallIcons } from '../../partials/CallIcons';

function ProfileHeader({ user = {}, extraContent }: any) {
    let { id } = useParams<{ id: string }>();
    const [userData] = useGlobalState("userData")
    const location = useLocation()
    const isMobile = UseIsMobile();

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="cover profile">
                    <div className="wrapper" style={{ padding: 0 }}>
                        <div className="image">
                            <img src={user?.bannerImage || cover} className="show-in-modal" alt="people" />
                        </div>
                    </div>
                    <div className="cover-info" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                        <div>
                            <div className="avatar">
                                <img src={user?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="people" />
                            </div>
                            <div className="name"><a href="#">{user?.nickname}</a></div>
                        </div>
                        <ul className="cover-nav">
                            <li className={`${location.pathname.includes("/profile/") && "active"}`}>
                                <Link to={`/profile/${id}`}>
                                    <i className="fa fa-fw fa-bars"></i> Timeline
                                </Link>
                            </li>
                            <li className={`${location.pathname.includes("/profile-about") && "active"}`}>
                                <Link to={`/profile-about/${id}`}>
                                    <i className="fa fa-fw fa-user"></i> About
                                </Link>
                            </li>
                            <li className={`${location.pathname.includes("/profile-pictures") && "active"}`}>
                                <Link to={`/profile-pictures/${id}`}>
                                    <i className="fa fa-picture-o"></i> Picture
                                            </Link>
                            </li>

                            <li className={`${location.pathname.includes("/profile-video") && "active"}`}>
                                <Link to={`/profile-video/${id}`}>
                                    <i className="fa fa-video-camera"></i> Video
                                            </Link>
                            </li>

                        </ul>
                        {!IsOwnProfile({ user }) && (
                            <div style={{ marginLeft: isMobile ? 'unset' : 'auto', alignItems: "center", flex: 1, display: "flex", justifyContent: isMobile ? "unset" : "flex-end", paddingRight: '2%' }}>
                                <div style={{ width: '25%', marginRight: '2rem'}}>
                                    <CallIcons disabled={!user || !user.id || user.isLogged === false} model={user} />
                                </div>
                                {user?.isLogged ? (
                                    <>
                                        <i style={{ paddingLeft: isMobile ? "15px" : 'unset', color: 'green', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                                        <p style={{ fontSize: 15, color: 'green', margin: 0 }}>Online</p>
                                    </>
                                ) : (
                                    <>
                                        <i style={{ paddingLeft: isMobile ? "15px" : 'unset', color: 'gray', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                                        <p style={{ fontSize: 15, color: 'gray', margin: 0 }}>Offline</p>
                                    </>
                                )}
                            </div>
                        )}
                        {extraContent && extraContent}
                    </div>
                    {user?.callNumber && (
                        <div style={{ boxShadow: 'unset', position: "absolute", top: '10%', backgroundColor: 'unset', right: 0 }} className="box profile-info n-border-top phone_cont">
                            <div className="phone_no_area">
                                <ul>
                                    <li style={{ fontStyle: 'italic', fontFamily: "AeroliteItalic", fontSize: isMobile ? '7vw' : '5vw' }}>Call me now for one to one live chat</li>
                                    <li style={{ textAlign: "center", fontFamily: "AeroliteItalic", fontSize: isMobile ? '7vw' : '5vw' }}>{user?.callNumber}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ProfileHeader;
