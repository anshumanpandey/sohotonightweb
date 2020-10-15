import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/user_detail.css';
import '../../css/cover.css';
import '../../css/timeline.css';
import '../../css/Profile.css';
import ProfileHeader from './ProfileHeader';

function AboutPage() {
    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader />
                </div>

                <div className="col-md-10 col-md-offset-1">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="widget">
                                <div className="widget-body">
                                    <div className="row">
                                        <div className="col-md-5 col-md-5 col-xs-12">
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    First Name:
                  </div>
                                                <div className="col-xs-7">
                                                    Olivia
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Last Name:
                  </div>
                                                <div className="col-xs-7">
                                                    Sallow:
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Gender:
                  </div>
                                                <div className="col-xs-7">
                                                    Female
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Email Address:
                  </div>
                                                <div className="col-xs-7">
                                                    olivia@gmail.com
                  </div>
                                            </div>
                                            <div className="row content-info">
                                                <div className="col-xs-5">
                                                    Date Of Birth:
                  </div>
                                                <div className="col-xs-7">
                                                    03/02/2000
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
                                                    012 3456 7891
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
                                                    Escort Services, Webcame Work, Phone Chat
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
                                                    Straight
                  </div>
                                            </div>

                                        </div>
                                        <div className="col-lg-7 col-md-7 col-xs-12">
                                            <h3>Lorem ipsum dolor sit amet</h3>
                                            <p className="contact-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
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