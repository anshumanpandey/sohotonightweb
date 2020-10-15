import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/Pictures.css';
import '../../css/cover.css';
import '../../css/timeline.css';
import '../../css/Profile.css';
import '../../css/photos1.css';
import '../../css/photos2.css';
import ProfileHeader from './ProfileHeader';

function PicturesPage() {
    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader />
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