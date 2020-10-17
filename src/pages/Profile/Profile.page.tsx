import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import ProfileHeader from './ProfileHeader';
import { Link, useParams } from 'react-router-dom';
import '../../css/cover.css';
import { parseISO } from 'date-fns'
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';
import useAxios from 'axios-hooks'
import PostWidgetForm from '../../partials/PostWidgetForm';
import PostItem from '../../partials/PostItem';

function ProfilePage() {
    let { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>({});

    const [{ data, loading, error }, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    const refetchUser = () => {
        getUser()
            .then(({ data }) => setUser(data))
    }

    useEffect(() => {
        refetchUser()
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
                                                        <li key={p.imageName}>
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
                                                        <li key={p.videoUrl}>
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
                                                            <PostWidgetForm onPostCrated={() => refetchUser()} />
                                                        </div>
                                                    )
                                                },
                                            })}
                                            {!loading && user?.Posts?.length == 0 && (
                                                <p style={{ fontSize: 16, textAlign: 'center', color: "#d32a6b" }}>No Post</p>
                                            )}
                                            {!loading && user?.Posts?.length != 0 && user?.Posts?.sort((a: any,b: any) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime())?.map((p: any) => {
                                                return <PostItem post={p} user={user} />
                                            })}
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