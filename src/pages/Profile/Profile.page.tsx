import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import ProfileHeader from './ProfileHeader';
import { Link, Redirect, useParams } from 'react-router-dom';
import '../../css/cover.css';
import { parseISO } from 'date-fns'
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';
import useAxios from 'axios-hooks'
import PostWidgetForm from '../../partials/PostWidgetForm';
import PostItem from '../../partials/PostItem';
import SohoModal from '../../partials/SohoModal';
import IsOwnProfile from '../../utils/IsOwnProfile';
import { callStarted, useGlobalState } from '../../state/GlobalState';
import SohoCallModal from '../../partials/CallModal';

function ProfilePage() {
    let { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<any>({});
    const [showPreviewModal, setShowPreviewModal] = useState<false | any>(false);
    const [showVideoModal, setShowVideoModal] = useState<false | any>(false);
    const [goToPayment, setGoToPayment] = useState<any>(false);
    const [redirectOnNotFound, setRedirectOnNotFound] = useState<boolean>(false);

    const [{ data, loading, error }, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    const refetchUser = (id: string) => {
        getUser({ url: `/user/public/getUser/${id}` })
            .then(({ data }) => setUser(data))
            .catch(() => setRedirectOnNotFound(true))
    }

    useEffect(() => {
        if (id) {
            refetchUser(id)
        }
    }, [id])
    
    if (redirectOnNotFound === true) return <Redirect to={`/list-post`} />
    if (goToPayment && goToPayment.id) return <Redirect to={`/payment/video/${goToPayment.id}`} />

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
                                                <Link to={`/profile-pictures/${id}`}>
                                                    {IsOwnProfile({ user }) ? (<><i className="fa fa-pencil-square-o" aria-hidden="true" /> Edit</>) : "View All"}
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="widget-body bordered-top  bordered-sky">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <ul className="img-grid" style={{ margin: "0 auto" }}>
                                                {user?.Pictures?.filter((v: any) => v.isFree)?.length == 0 && <p>No images</p>}
                                                {user?.Pictures?.length != 0 && user?.Pictures?.filter((v: any) => v.isFree)?.map((p: any) => {
                                                    return (
                                                        <li onClick={() => setShowPreviewModal(p)} key={p.imageName}>
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
                                                <Link to={`/profile-video/${id}`}>
                                                    {IsOwnProfile({ user }) ? (<><i className="fa fa-pencil-square-o" aria-hidden="true" /> Edit</>) : "View All"}
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="widget-body bordered-top  bordered-sky">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <ul className="img-grid" style={{ margin: "0 auto" }}>
                                                {user?.Videos?.filter((v: any) => v.isFree)?.length == 0 && <p>No Videos</p>}
                                                {user?.Videos?.length != 0 && user?.Videos?.filter((v: any) => v.isFree)?.map((p: any) => {
                                                    return (
                                                        <li style={{ position: 'relative'}} key={p.videoUrl}>
                                                            <video controls style={{ height: 80 }} src={p.videoUrl} />
                                                            <div onClick={() => {setShowVideoModal(p)}} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}></div>
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
                                            {IsOwnProfile({ user }) && (
                                                <div style={{ margin: 0 }} className="box profile-info n-border-top">
                                                    <PostWidgetForm onPostCrated={() => refetchUser(id)} />
                                                </div>
                                            )}
                                            {!loading && user?.Posts?.length == 0 && (
                                                <p style={{ fontSize: 16, textAlign: 'center', color: "#d32a6b" }}>No Post</p>
                                            )}
                                            {!loading && user?.Posts?.length != 0 && user?.Posts?.sort((a: any, b: any) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime())?.map((p: any) => {
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
            <SohoModal
                size="lg"
                onClose={() => setShowPreviewModal(false)}
                show={showPreviewModal != false}
                title="View Image"
                footer={() => <button onClick={() => {
                    setShowPreviewModal(false)
                }} type="button" className="btn btn-default">Close</button>}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img style={{ maxHeight: "350px" }} src={showPreviewModal.imageName} />
                </div>
            </SohoModal>

            <SohoModal
                size="lg"
                onClose={() => setShowVideoModal(false)}
                show={showVideoModal != false}
                title="View Video"
                footer={() => {
                    return (
                        <>
                            {AuthenticatedFactory({
                                user: user,
                                authenticated: () => {
                                    return (
                                        <button onClick={() => {
                                            setShowVideoModal(false)
                                        }} type="button" className="btn btn-default">Close</button>
                                    );
                                },
                                nonAuthenticated: () => {
                                    return (
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    const cloned = { ...showVideoModal }
                                                    setShowVideoModal(false)
                                                    setTimeout(() => {
                                                        setGoToPayment(cloned)
                                                    }, 0)
                                                }}
                                                href="#"
                                                style={{ color: "#cf2c6b" }}
                                            >
                                                <i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now
                                        </a>
                                        </div>
                                    )
                                }
                            })}
                        </>
                    );
                }}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <video style={{ maxHeight: "350px" }} controls autoPlay src={showVideoModal.videoUrl} />
                </div>
            </SohoModal>
            <SohoCallModal />
            <Footer />
        </>
    );
}
export default ProfilePage;