import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/user_detail.css';
import '../../css/cover.css';
import '../../css/timeline.css';
import '../../css/Profile.css';
import ProfileHeader from './ProfileHeader';
import useAxios from 'axios-hooks'
import { useParams } from 'react-router-dom';

function AboutPage() {
    let { id } = useParams<{ id: string }>();
    const [editing, setEditing] = useState(false);
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
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    First Name:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.firstName}
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Last Name:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.lastName}
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Gender:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.gender}
                  </div>
                                            </div>
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
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Address:
                  </div>
                                                <div className="col-xs-7">
                                                    Sacramento, CA
                  </div>
                                            </div>

                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Mobile/Cell Number:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.phoneNumber}
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Mamber Types:
                  </div>
                                                <div className="col-xs-7">
                                                    Lorem ipsum
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Select Service:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.escortServices && "Escort Services"}
                                                    {user?.phoneChat && "Phone chat"}
                                                    {user?.webcamWork && "Webcame Work"}
                                                    {user?.contentProducer && "Content Producer"}
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Social Media Advertising:
                  </div>
                                                <div className="col-xs-7">
                                                    Allow My Profile
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Skype:
                  </div>
                                                <div className="col-xs-7">
                                                    Subscribe Now
                  </div>
                                            </div>

                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Orientation:
                  </div>
                                                <div className="col-xs-7">
                                                    {user?.orientation}
                  </div>
                                            </div>

                                        </div>
                                        <div className="col-lg-7 col-md-7 col-xs-12">
                                            {editing == true && <textarea style={{ width: '100%', height: '100%' }} value=""></textarea>}
                                            {editing == false && (
                                                <p className="contact-description">
                                                    {user?.aboutYouDetail}
                                                </p>
                                            )}
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