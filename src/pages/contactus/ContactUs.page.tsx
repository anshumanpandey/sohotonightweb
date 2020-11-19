import React from 'react';
import { useFormik } from 'formik';
import useAxios from 'axios-hooks'
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';

function ContactUs() {
    const [{ data, loading, error }, sendMail] = useAxios({
        url: '/user/public/contact',
        method: 'POST'
    }, { manual: true });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: '',
        },
        onSubmit: data => {
            sendMail({
                data: {
                    name: formik.values.name,
                    email: formik.values.email,
                    message: formik.values.message,
                }
            })
            .then(() => {

            })
        },
    });
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

                                            <p>
                                                Remember, Sohotonight.com is an Adult Entertainment Service Provider Directory, nothing more.  We are not affiliated with the persons advertising on this site nor do we control, condone, coordinate or manage any of their activities on this site or elsewhere.  Your use of this site is subject to the Terms of Use and you should be aware of our Disclaimer.
                                                If you would like to get in touch with us regarding the operation of this website, then you may write to the address below.  If you have any enquiries email us on admin@sohotonight.com. Only legal adults may use this Website.  All registered members have consented to being at least 18 years old.  We would kindly ask you to report any members you believe to be underage, report at admin@sohotonight.com
                                            </p>


                                            <div className="basic-info-item"> <span className="icon"><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                                                <h3 style={{ margin: 0 }}>Website Enquiries </h3>
                                                <p style={{ paddingTop: 10 }}><span>Sohotonight Limited, Lytchett House, 13 Freeland Park, Wareham Road, Poole, Dorset, BH16 6FA </span></p>
                                            </div>

                                            <div className="basic-info-item"> <span className="icon"><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                                                <h3 style={{ margin: 0 }}>Billing Enquiries  </h3>
                                                <p style={{ paddingTop: 10 }}><span>Payments to Sohotonight limited appear on your statement with a website address and phone number.  Visit the Site, Call the number or write to Sohotonight Limited, Lytchett House, 13 Freeland Park, Wareham Road, Poole, Dorset, BH16 6FA regarding any specific payment enquiry. </span></p>
                                            </div>

                                            <div className="basic-info-item"> <span className="icon"><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                                                <h3 style={{ margin: 0 }}>Law Enforcement & Police </h3>
                                                <p style={{ paddingTop: 10 }}><span>We cooperate fully with law enforcement and the police </span></p>
                                            </div>

                                            <div className="basic-info-item"> <span className="icon"><i className="fa fa-location-arrow" aria-hidden="true"></i></span>
                                                <h3 style={{ margin: 0 }}>Banks & Credit Card Issuers </h3>
                                                <p style={{ paddingTop: 10 }}><span>If You want to lodge any complaints or wish to dispute any payment, please provide full details to admin@sohotonight.com </span></p>
                                            </div>

                                            <div className="basic-info-item"><span className="icon"><i className="fa fa-phone" aria-hidden="true"></i></span>

                                                <p className="basic-info-item_no_area"> <span>
                                                    <a href="tel:442032890198">012 3456 7891</a></span></p>

                                            </div>

                                            <div className="basic-info-item"><span className="icon"><i className="fa fa-envelope" aria-hidden="true"></i></span>

                                                <p className="basic-info-item_no_area"> <span><a href="mailto:support@gvtechsolution.com">admin@sohotonight.com</a></span></p>

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


                                            <div role="form" >
                                                <div className="form-group">
                                                    <label htmlFor="xsinput">Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control input-sm"
                                                        id="xsinput"
                                                        placeholder="Nickname"
                                                        name="name"
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="lginput">Email Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="lginput"
                                                        placeholder="Email Address"
                                                        name="email"
                                                        value={formik.values.email}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </div>


                                                <div className="form-group">
                                                    <label htmlFor="lginput">Message</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="message"
                                                        value={formik.values.message}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        style={{ height: "109px", resize: "none" }}>

                                                        </textarea>
                                                </div>

                                                <div className="form-group">
                                                    <input onClick={() => formik.handleSubmit()} type="submit" value="Submit" />
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
export default ContactUs;