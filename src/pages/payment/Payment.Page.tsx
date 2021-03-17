import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import BuyTokenForm from '../../partials/BuyTokenForm';

function PaymentPage() {
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
                                        <span className="widget-caption" style={{ fontSize: "18px" }}><strong>Payment Info</strong></span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                            <div>
                                                <BuyTokenForm />
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
export default PaymentPage;