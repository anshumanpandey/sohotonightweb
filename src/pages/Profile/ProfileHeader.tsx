import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import cover from '../../img/Cover/profile-cover.jpg';
import '../../css/cover.css';
import { BrandColor } from '../../utils/Colors';
import { useGlobalState } from '../../state/GlobalState';
import IsOwnProfile from '../../utils/IsOwnProfile';

function ProfileHeader({ user, extraContent }: any) {
    let { id } = useParams<{ id: string }>();
    const location = useLocation()
    const [userData] = useGlobalState("userData")

    console.log(user.id)
    console.log(IsOwnProfile({ user: user }))

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="cover profile">
                    <div className="wrapper" style={{ padding: 0 }}>
                        <div className="image">
                            <img src={user?.bannerImage || cover} className="show-in-modal" alt="people" />
                        </div>
                    </div>
                    <div className="cover-info" style={{ display: 'flex' }}>
                        <div className="avatar">
                            <img src={user?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="people" />
                        </div>
                        <div className="name"><a href="#">{user?.nickname}</a></div>
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
                            <div style={{ marginLeft: 'auto', alignItems: "center", flex: 1, display: "flex", justifyContent: "flex-end", paddingRight: '2%' }}>
                                {user?.isLogged ? (
                                    <>
                                        <i style={{ color: 'green', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                                        <p style={{ fontSize: 18, color: 'green', margin: 0 }}>Online</p>
                                    </>
                                ) : (
                                        <>
                                            <i style={{ color: 'gray', marginRight: '0.5%' }} className="fa fa-circle" aria-hidden="true"></i>
                                            <p style={{ fontSize: 18, color: 'gray', margin: 0 }}>Offline</p>
                                        </>
                                    )}
                            </div>
                        )}
                        {extraContent && extraContent}
                    </div>
                    <div style={{ boxShadow: 'unset', position: "absolute", top: '10%', backgroundColor: 'unset', right: 0 }} className="box profile-info n-border-top phone_cont">
                        <div className="phone_no_area">
                            <ul>
                                <li style={{ fontStyle: 'italic'}}>Call me now for one to one live chat</li>
                                <li style={{ textAlign: "center" }}>{user?.callNumber}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProfileHeader;
