import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';

function ContactUs() {
    return (
        <>
        <NavBar />
        <div className="container page-content ">
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">

                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="widget">

                                <div className="widget-body">


                                    <div className="main-contact-section">

                                        <h2>Quick Contact</h2>




                                        <div className="basic-info-item"> <span className="icon"><i className="fa fa-location-arrow" aria-hidden="true"></i></span>

                                            <p><span>Unit 17336, London, England,
W1A 6US</span></p>

                                        </div>
                                        <div className="basic-info-item"><span className="icon"><i className="fa fa-phone" aria-hidden="true"></i></span>

                                            <p className="basic-info-item_no_area"> <span>
                                                <a href="tel:442032890198">012 3456 7891</a></span></p>

                                        </div>

                                        <div className="basic-info-item"><span className="icon"><i className="fa fa-envelope" aria-hidden="true"></i></span>

                                            <p className="basic-info-item_no_area"> <span><a href="mailto:support@gvtechsolution.com">support@sohotonight.com</a></span></p>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="widget">

                                <div className="widget-body">


                                    <div className="main-contact-section">

                                        <h2>Get In Touch </h2>


                                        <form role="form" action="">
                                            <div className="form-group">
                                                <label htmlFor="xsinput">Name</label>
                                                <input type="text" className="form-control input-sm" id="xsinput" placeholder="Nickname" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="lginput">Email Address</label>
                                                <input type="text" className="form-control" id="lginput" placeholder="Email Address" />
                                            </div>


                                            <div className="form-group">
                                                <label htmlFor="lginput">Message</label>
                                                <textarea name="" className="form-control" style={{ height: "109px", resize: "none" }}></textarea>
                                            </div>


















                                            <div className="form-group">
                                                <input type="submit" value="Submit" />
                                            </div>

                                        </form>






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
export default ContactUs;