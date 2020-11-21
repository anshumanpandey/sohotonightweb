import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import SohoLoginForm from '../../partials/SohoLoginForm';

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
                                            <SohoLoginForm />
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