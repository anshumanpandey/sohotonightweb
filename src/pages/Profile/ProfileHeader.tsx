import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import cover from '../../img/Cover/profile-cover.jpg';
import '../../css/cover.css';
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';

function ProfileHeader({ user, extraContent }: any) {
    let { id } = useParams<{ id: string }>();
    const location = useLocation()

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="cover profile">
                    <div className="wrapper" style={{ padding: 0 }}>
                        <div className="image">
                            <img src={user?.profilePic || cover} className="show-in-modal" alt="people" />
                        </div>

                    </div>
                    <div className="cover-info">
                        <div className="avatar">
                            <img src={user?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="people" />
                        </div>
                        <div className="name"><a href="#">{user?.firstName} {user?.lastName}</a></div>
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
                            {AuthenticatedFactory({
                                authenticated: () => {
                                    return (
                                        <li className={`${location.pathname.includes("/profile-pictures") && "active"}`}>
                                            <Link to={`/profile-pictures/${id}`}>
                                                <i className="fa fa-picture-o"></i> Picture
                                            </Link>
                                        </li>
                                    )
                                },
                                nonAuthenticated: () => {
                                    return (
                                        <li className={`${location.pathname.includes("/profile-pictures") && "active"}`}>
                                            <Link to={`/profile-pictures/${id}`}>
                                                <i className="fa fa-picture-o"></i> Picture
                                            </Link>
                                        </li>
                                    )
                                }
                            })}

                            {AuthenticatedFactory({
                                authenticated: () => {
                                    return (
                                        <li className={`${location.pathname.includes("/profile-video") && "active"}`}>
                                            <Link to={`/video-upload/${id}`}>
                                                <i className="fa fa-video-camera"></i> Video
                                            </Link>
                                        </li>
                                    )
                                },
                                nonAuthenticated: () => {
                                    return (
                                        <li className={`${location.pathname.includes("/profile-video") && "active"}`}>
                                            <Link to={`/profile-video/${id}`}>
                                                <i className="fa fa-video-camera"></i> Video
                                            </Link>
                                        </li>
                                    )
                                }
                            })}

                        </ul>
                        {extraContent && extraContent}
                    </div>
                    {user?.phoneNumber && (
                        <div style={{ position: "absolute", top: 0, backgroundColor: "#fff9", width: "40%", right: 0 }} className="box profile-info n-border-top phone_cont">
                            <div className="phone_no_area">
                                <ul>
                                    <li>Talk to me at</li>
                                    <li style={{ textAlign: "center" }}>{user?.phoneNumber}</li>
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
