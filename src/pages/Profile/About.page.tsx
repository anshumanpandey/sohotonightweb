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

function AboutPage() {
    let { id } = useParams<{ id: string }>();
    const [redirect, setRedirect] = useState(false);
    const [user, setUser] = useState<any>({});

    const [{ data, loading, error }, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    if (redirect) {
        return <Redirect to="/profile-edit" />
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
                                        <div className="col-md-5 col-md-5 col-xs-12">
                                            {AuthenticatedFactory({
                                                user: user,
                                                authenticated: () => {
                                                    return (
                                                        <>
                                                            <div className="row content-info">
                                                                <div className="col-xs-5">
                                                                    First Name:
                                                                </div>
                                                                <div className="col-xs-7">
                                                                    {user?.firstName || "N/A"}
                                                                </div>
                                                            </div>
                                                            <div className="row content-info">
                                                                <div className="col-xs-5">
                                                                    Last Name:
                                                            </div>
                                                                <div className="col-xs-7">
                                                                    {user?.lastName || "N/A"}
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                },
                                                nonAuthenticated: () => {
                                                    return <>
                                                        <div className="row content-info">
                                                            <div className="col-xs-5">
                                                                Nickname:
                                                            </div>
                                                            <div className="col-xs-7">
                                                                {user?.nickname || "N/A"}
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            })}
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Gender:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.gender || "N/A"}
                                                </div>
                                            </div>
                                            {AuthenticatedFactory({
                                                user: user,
                                                authenticated: () => {
                                                    return (
                                                        <>
                                                            <div className="row content-info">
                                                                <div className="col-xs-5">
                                                                    Email Address:
                                                                </div>
                                                                <div className="col-xs-7">
                                                                    {user?.emailAddress}
                                                                </div>
                                                            </div>
                                                            <div className="row content-info">
                                                                <div className="col-xs-5">
                                                                    Date Of Birth:
                                                                </div>
                                                                <div className="col-xs-7">
                                                                    {user?.dayOfBirth}/{user?.monthOfBirth}/{user?.yearOfBirth}
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                },
                                                nonAuthenticated: () => {
                                                    return (
                                                        <>
                                                            <div className="row content-info">
                                                                <div className="col-xs-5">
                                                                    Age:
                                                                </div>
                                                                <div className="col-xs-7">
                                                                    {GetUserAge(user)}
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                }
                                            })}
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Address:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.town || "N/A"}
                                                </div>
                                            </div>

                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Height:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.feet ? user?.feet : <p>N/A</p>}
                                                </div>

                                            </div>

                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Orientation:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.orientation || "N/A"}
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-lg-7 col-md-7 col-xs-12">
                                            <h3>{user?.aboutYouSummary}</h3>
                                            <p className="contact-description">
                                                {user?.aboutYouDetail}
                                            </p>
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
export default AboutPage;