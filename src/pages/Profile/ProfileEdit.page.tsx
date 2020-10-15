import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/ProfileEdit.css';
import '../../css/cover.css';
import '../../css/timeline.css';

function ProfileEditPage() {
    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="cover profile">
                                <div className="wrapper">
                                    <div className="image">
                                        <img src="img/Cover/profile-cover.jpg" className="show-in-modal" alt="people" />
                                    </div>

                                </div>
                                <div className="cover-info">
                                    <div className="avatar">
                                        <img src="img/Photos/2.jpg" alt="people" />
                                    </div>
                                    <div className="name"><a href="#">John Breakgrow jr.</a></div>
                                    <ul className="cover-nav">
                                        <li className="active"><a href="https://sohotonight.azurewebsites.net/profile-edite.html?"><i className="fa fa-fw fa-bars"></i> Timeline</a></li>
                                        <li><a href="https://sohotonight.azurewebsites.net/about-edit.html"><i className="fa fa-fw fa-user"></i> About</a></li>
                                        <li><a href="https://sohotonight.azurewebsites.net/picture-edite.html"><i className="fa fa-picture-o"></i>&nbsp; Picture</a></li>
                                        <li><a href="https://sohotonight.azurewebsites.net/video-edite.html"><i className="fa fa-video-camera"></i>&nbsp; Video</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-5">

                            <div className="widget widget-friends">
                                <div className="widget-header">
                                    <div className="pic_pic_link">
                                        <ul>
                                            <li>Picture</li>
                                            <li><a href="https://sohotonight.azurewebsites.net/picture-edite.html"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Edit</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="widget-body bordered-top  bordered-sky">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <ul className="img-grid" style={{ margin: "0 auto" }}>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/1.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/2.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/3.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/4.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/5.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li className="clearfix">
                                                    <a href="#">
                                                        <img src="img/Photos/6.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/7.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/8.jpg" alt="image" />
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <img src="img/Photos/9.jpg" alt="image" />
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
                                            <li><a href="https://sohotonight.azurewebsites.net/video-edite.html"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Edit</a></li>
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
                                            <li><a href="https://sohotonight.azurewebsites.net/about-edit.html"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Edit</a></li>
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
                                                <div className="col-sm-8">Male</div>
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

                                            <div className="box box-widget">
                                                <div className="box-header with-border">
                                                    <div className="user-block">
                                                        <img className="img-circle" src="img/Photos/2.jpg" alt="User Image" />
                                                        <span className="username"><a href="#">John Breakgrow jr.</a></span>
                                                        <span className="description">Shared publicly - 7:30 PM Today</span>
                                                    </div>

                                                    <div className="user-block2">
                                                        <a href="https://sohotonight.azurewebsites.net/video.html"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp; Edit</a>
                                                    </div>
                                                </div>

                                                <div className="box-body" style={{ display: "block" }}>
                                                    <img className="img-responsive show-in-modal" src="img/Photos/profile-image.jpg" alt="Photo" />
                                                    <p style={{ margin: "7px 0 0 0 " }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>

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
export default ProfileEditPage;