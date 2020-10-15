import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/Pictures.css';
import '../../css/cover.css';
import '../../css/timeline.css';
import '../../css/Profile.css';
import '../../css/photos1.css';
import '../../css/photos2.css';
import '../../css/photos3.css';

function PicturesPage() {
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
                                        <li><a href="profile.html"><i className="fa fa-fw fa-bars"></i> Timeline</a></li>
                                        <li><a href="about.html"><i className="fa fa-fw fa-user"></i> About</a></li>
                                        <li className="active"><a href="https://sohotonight.azurewebsites.net/picture.html"><i className="fa fa-picture-o"></i>&nbsp; Picture</a></li>
                                        <li><a href="https://sohotonight.azurewebsites.net/video.html"><i className="fa fa-video-camera"></i>&nbsp; Video</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                <div className="mix col-sm-4 page1 page4 margin30">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/2.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mix col-sm-4 page2 page3 margin30">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/1.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mix col-sm-4  page3 page2 margin30 ">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/3.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mix col-sm-4  page4 margin30">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/4.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mix col-sm-4 page1 margin30 ">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/5.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mix col-sm-4  page2 margin30">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/6.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mix col-sm-4  page3 margin30">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/7.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="mix col-sm-4 page4  margin30">
                                    <div className="item-img-wrap ">
                                        <img src="img/Photos/8.jpg" className="img-responsive" alt="workimg" />
                                        <div className="item-img-overlay">
                                            <a href="#" className="show-image">
                                                <span className="item-img_text"><i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now <br />£5.00</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row gallery-bottom">
                        <div className="col-sm-6">
                            <ul className="pagination">
                                <li>
                                    <a href="#" aria-label="Previous">
                                        <span aria-hidden="true">«</span>
                                    </a>
                                </li>
                                <li className="active"><a href="#">1</a></li>
                                <li><a href="#">2</a></li>
                                <li><a href="#">3</a></li>
                                <li><a href="#">4</a></li>
                                <li><a href="#">5</a></li>
                                <li>
                                    <a href="#" aria-label="Next">
                                        <span aria-hidden="true">»</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default PicturesPage;