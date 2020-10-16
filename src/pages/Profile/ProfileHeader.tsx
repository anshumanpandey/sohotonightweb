import React from 'react';
import { Link, useParams } from 'react-router-dom';
import cover from '../../img/Cover/profile-cover.jpg';
import '../../css/cover.css';
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';

function ProfileHeader({ user }: any) {
    let { id } = useParams<{ id: string }>();

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
                            <li>
                                <Link to={`/profile/${id}`}>
                                    <i className="fa fa-fw fa-bars"></i> Timeline
                                </Link>
                            </li>
                            <li className="active">
                                <Link to={`/profile-about/${id}`}>
                                    <i className="fa fa-fw fa-user"></i> About
                                </Link>
                            </li>
                            {AuthenticatedFactory({
                                authenticated: () => {
                                    return (
                                        <li className="active">
                                            <Link to={`/picture-upload/${id}`}>
                                                <i className="fa fa-picture-o"></i> Picture
                                            </Link>
                                        </li>
                                    )
                                },
                                nonAuthenticated: () => {
                                    return (
                                        <li className="active">
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
                                        <li className="active">
                                            <Link to={`/video-upload/${id}`}>
                                                <i className="fa fa-video-camera"></i> Video
                                            </Link>
                                        </li>
                                    )
                                },
                                nonAuthenticated: () => {
                                    return (
                                        <li>
                                            <Link to={`/profile-video/${id}`}>
                                                <i className="fa fa-video-camera"></i> Video
                                            </Link>
                                        </li>
                                    )
                                }
                            })}

                        </ul>
                    </div>
                    {user?.phoneNumber && (
                        <div style={{ position: "absolute", top: 0, backgroundColor: "#fff9", width: "40%", right: 0 }} className="box profile-info n-border-top phone_cont">
                            <div className="phone_no_area">
                                <ul>
                                    <li>Message Me At</li>
                                    <li><i className="fa fa-phone-square" aria-hidden="true"></i>&nbsp; 012 3456 7891</li>
                                </ul>
                            </div>
                            <div className="skype_msg"><a href="#"><i className="fa fa-video-camera"></i>&nbsp;  See Me</a></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ProfileHeader;
