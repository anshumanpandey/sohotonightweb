import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import ProfileHeader from './ProfileHeader';
import { Link } from 'react-router-dom';
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


function ProfilePage() {
    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader />
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
                                                        return (<Link to="/picture-upload">
                                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                                                        </Link>);
                                                    },
                                                    nonAuthenticated: () => {
                                                        return (<Link to="/profile-pictures">
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
                                                <li>
                                                    <a href="#">
                                                        <img src={photo1} alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={photo2} alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={photo3} alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={photo4} alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={photo5} alt="image" />
                                                    </a>
                                                </li>
                                                <li className="clearfix">
                                                    <a href="#">
                                                        <img src={photo6} alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={photo7} alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={photo8} alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src={photo8} alt="image" />
                                                    </a>
                                                </li>
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
                                                        return (<Link to="/video-upload">
                                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                                                        </Link>);
                                                    },
                                                    nonAuthenticated: () => {
                                                        return (<Link to="/profile-video">
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
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li className="clearfix">
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
                                                <li>
                                                    <iframe src="https://www.youtube.com/embed/VXhRSJILId0" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                </li>
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
                                            <li>
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
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="widget-body bordered-top bordered-sky">
                                    <ul className="list-unstyled profile-about margin-none">
                                        <li className="padding-v-5">
                                            <div className="row">
                                                <div className="col-sm-4"><span className="text-muted">Date of Birth</span></div>
                                                <div className="col-sm-8">12 January 1990</div>
                                            </div>
                                        </li>
                                        <li className="padding-v-5">
                                            <div className="row">
                                                <div className="col-sm-4"><span className="text-muted">Job</span></div>
                                                <div className="col-sm-8">Ninja developer</div>
                                            </div>
                                        </li>
                                        <li className="padding-v-5">
                                            <div className="row">
                                                <div className="col-sm-4"><span className="text-muted">Gender</span></div>
                                                <div className="col-sm-8">Female</div>
                                            </div>
                                        </li>
                                        <li className="padding-v-5">
                                            <div className="row">
                                                <div className="col-sm-4"><span className="text-muted">Lives in</span></div>
                                                <div className="col-sm-8">Miami, FL, USA</div>
                                            </div>
                                        </li>
                                        <li className="padding-v-5">
                                            <div className="row">
                                                <div className="col-sm-4"><span className="text-muted">Credits</span></div>
                                                <div className="col-sm-8">249</div>
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
                                            <div className="box profile-info n-border-top phone_cont">
                                                <div className="phone_no_area">
                                                    <ul>
                                                        <li>Message Me At</li>
                                                        <li><i className="fa fa-phone-square" aria-hidden="true"></i>&nbsp; 012 3456 7891</li>
                                                    </ul>
                                                </div>
                                                <div className="skype_msg"><a href="#"><i className="fa fa-video-camera"></i>&nbsp;  See Me</a></div>
                                            </div>
                                            {AuthenticatedFactory({
                                                authenticated: () => {
                                                    return (
                                                        <div className="box profile-info n-border-top">
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
                                                        <span className="username"><a href="#">John Breakgrow jr.</a></span>
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