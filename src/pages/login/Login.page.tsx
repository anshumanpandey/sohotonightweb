import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';

function LoginPage() {
    return (
        <>
            <NavBar />
            <div className="container page-content ">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="widget">
                                    <div className="widget-header">
                                        <span className="widget-caption">Login</span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                            <form role="form" action="https://sohotonight.azurewebsites.net/profile-edite.html">

                                                <div className="form-group">
                                                    <label htmlFor="xsinput">Nickname</label>
                                                    <input type="text" className="form-control input-sm" id="xsinput" placeholder="Nickname" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="sminput">Password</label>
                                                    <input type="text" className="form-control input-sm" id="sminput" placeholder="Passwordt" />
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