import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import ProfileHeader from './ProfileHeader';
import { Link, useParams } from 'react-router-dom';
import '../../css/cover.css';
import photo1 from '../../img/Photos/1.jpg';
import photo2 from '../../img/Photos/2.jpg';
import photo3 from '../../img/Photos/3.jpg';
import photo4 from '../../img/Photos/4.jpg';
import photo5 from '../../img/Photos/5.jpg';
import photo6 from '../../img/Photos/6.jpg';
import photo7 from '../../img/Photos/7.jpg';
import photo8 from '../../img/Photos/8.jpg';
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';
import useAxios from 'axios-hooks'

function ProfilePage() {
    let { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>({});

    const [{ data, loading, error }, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader user={user} />
                    <div className="row">
                        <div className="col-md-5">
                            <div className="widget widget-friends">
                                <div className="widget-header">
                                    <div className="pic_pic_link">
                                        <ul>
                                            <li>Picture</li>
                                            <li>
                                                {AuthenticatedFactory({
                                                    authenticated: () => {
                                                        return (<Link to={`/profile-pictures/${id}`}>
                                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                                                        </Link>);
                                                    },
                                                    nonAuthenticated: () => {
                                                        return (<Link to={`/profile-pictures/${id}`}>
                                                            View All
                                                        </Link>);
                                                    }
                                                })}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="widget-body bordered-top  bordered-sky">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <ul className="img-grid" style={{ margin: "0 auto" }}>
                                                {user?.Pictures?.length == 0 && <p>No images</p>}
                                                {user?.Pictures?.length != 0 && user?.Pictures?.map((p: any) => {
                                                    return (
                                                        <li>
                                                            <a href="#">
                                                                <img src={p.imageName} alt="image" />
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="widget widget-friends">
                                <div className="widget-header">
                                    <div className="pic_pic_link">
                                        <ul>
                                            <li>Video</li>
                                            <li>
                                                {AuthenticatedFactory({
                                                    authenticated: () => {
                                                        return (<Link to={`/video-upload/${id}`}>
                                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                                                        </Link>);
                                                    },
                                                    nonAuthenticated: () => {
                                                        return (<Link to={`/profile-video/${id}`}>
                                                            View All
                                                        </Link>);
                                                    }
                                                })}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="widget-body bordered-top  bordered-sky">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <ul className="img-grid" style={{ margin: "0 auto" }}>
                                                {user?.Videos?.length == 0 && <p>No Videos</p>}
                                                {user?.Videos?.length != 0 && user?.Videos?.map((p: any) => {
                                                    return (
                                                        <li>
                                                            <a href="#">
                                                                <video controls style={{ height: 80}} src={p.videoUrl} />
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="widget">
                                <div className="widget-header">
                                    <div className="pic_pic_link">
                                        <ul>
                                            <li>About</li>
                                            <li></li>
                                            {/*<li>
                                                {AuthenticatedFactory({
                                                    authenticated: () => {
                                                        return (<Link to="/about-edit">
                                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                                                        </Link>);
                                                    },
                                                    nonAuthenticated: () => {
                                                        return (<Link to="/profile-video">
                                                            View All
                                                        </Link>);
                                                    }
                                                })}
                                            </li>*/}
                                        </ul>
                                    </div>
                                </div>

                                <div className="widget-body bordered-top bordered-sky">
                                    <ul className="list-unstyled profile-about margin-none">
                                        <li className="padding-v-5">
                                            <div className="row">
                                                <div className="col-sm-4"><span className="text-muted">Date of Birth</span></div>
                                                <div className="col-sm-8">{user?.dayOfBirth} {user?.monthOfBirth} {user?.yearOfBirth}</div>
                                            </div>
                                        </li>
                                        <li className="padding-v-5">
                                            <div className="row">
                                                <div className="col-sm-4"><span className="text-muted">Gender</span></div>
                                                <div className="col-sm-8">{user?.gender}</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>


                        <div className="col-md-7">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {AuthenticatedFactory({
                                                authenticated: () => {
                                                    return (
                                                        <div style={{ margin: 0 }} className="box profile-info n-border-top">
                                                            <form>
                                                                <textarea className="form-control input-lg p-text-area" rows={2} placeholder="Whats in your mind today?"></textarea>
                                                            </form>
                                                            <div className="box-footer box-form">
                                                                <button type="button" className="btn btn-azure pull-right">Post</button>
                                                                <ul className="nav nav-pills">
                                                                    <li><a href="#"><i className="fa fa-map-marker"></i></a></li>
                                                                    <li><a href="#"><i className="fa fa-camera"></i></a></li>
                                                                    <li><a href="#"><i className=" fa fa-film"></i></a></li>
                                                                    <li><a href="#"><i className="fa fa-microphone"></i></a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )
                                                },
                                            })}

                                            <div className="box box-widget">
                                                <div className="box-header with-border">
                                                    <div className="user-block">
                                                        <img className="img-circle" src="img/Photos/2.jpg" alt="User Image" />
                                                        <span className="username"><a href="#">{user?.firstName} {user?.lastName}</a></span>
                                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                                    </div>
                                                </div>

                                                <div className="box-body" style={{ display: "block" }}>
                                                    <img className="img-responsive show-in-modal" src="img/Photos/profile-image.jpg" alt="Photo" />
                                                    <p style={{ margin: "7px 0 0 0" }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>

                                                </div>


                                            </div>


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
export default ProfilePage;