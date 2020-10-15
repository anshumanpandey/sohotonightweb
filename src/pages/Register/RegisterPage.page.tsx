import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import SohoLoginForm from '../../partials/SohoLoginForm';
import "../../css/login_register.css"

function LoginPage() {
    return (
        <>
            <NavBar />
            <div className="container page-content ">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <div className="widget-header">
                                        <span className="widget-caption">Login</span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                            <SohoLoginForm />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <div className="widget-header">
                                        <span className="widget-caption">Register</span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                            <form role="form" action="https://sohotonight.azurewebsites.net/profile-form.html">
                                                <div className="form-group">
                                                    <label htmlFor="xsinput">Nickname</label>
                                                    <input type="text" className="form-control input-sm" id="xsinput" placeholder="Nickname" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="sminput">Password</label>
                                                    <input type="text" className="form-control input-sm" id="sminput" placeholder="Passwordt" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="definpu">Confirm Password</label>
                                                    <input type="text" className="form-control" id="definput" placeholder="Confirm Password" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="lginput">Email Address</label>
                                                    <input type="text" className="form-control" id="lginput" placeholder="Email Address" />
                                                </div>





                                                <div className="form-group">
                                                    <label htmlFor="xlginput">Date Of Birth</label>
                                                    <div className="row">
                                                        <div className="col-md-4 col-sm-4 col-xs-12">
                                                            <select style={{ width: "100%" }}>
                                                                <option>Day</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col-xs-12">
                                                            <select style={{ width: "100%" }}>
                                                                <option>Month</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-4 col-sm-4 col-xs-12">
                                                            <select style={{ width: "100%" }}>
                                                                <option>Year</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-group">
                                                    <label htmlFor="lginput">Country</label>
                                                    <select style={{ width: "100%" }}>
                                                        <option></option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="lginput">Mamber Types</label>
                                                    <select style={{ width: "100%" }}>
                                                        <option></option>
                                                    </select>
                                                </div>




                                                <h5>Select Service</h5>


                                                <div className="row">
                                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">Escort Services</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">Webcame Work</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">Phone Chat</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">Content Producer</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">Alternative <a href="#">Choose Practices</a></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">Other Services <a href="#">Specify Now</a></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <h5>Privacy & Legal</h5>

                                                <div className="row">


                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">I accept and consert to the Site's
                                        <a href="#">Policies and User Agreement</a></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input type="checkbox" />
                                                                <span className="text">I am happy to receive promotional emails,
You can change this seatting at any time</span>
                                                            </label>
                                                        </div>
                                                    </div>


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
export default LoginPage;