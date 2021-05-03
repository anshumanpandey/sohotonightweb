import React, { useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import BuyTokenForm from '../../partials/BuyTokenForm';
import { BrandColor } from '../../utils/Colors';
import SohoButton from '../../partials/SohoButton';
import { useHistory } from 'react-router-dom';

function PaymentPage() {
    let history = useHistory();
    const [paymentDone , setPaymentDone] = useState(false)
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
                                        <span className="widget-caption" style={{ fontSize: "18px" }}><strong>Buy Tokens</strong></span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                                {paymentDone === false && (<BuyTokenForm onPaymenDone={() => setPaymentDone(true)} />)}
                                                {paymentDone === true && (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                            <img src={require("../../img/Photos/logo.png")} />
                                                            <h3 style={{ color: BrandColor }}>Thanks for your payment</h3>
                                                            <p>Your payment details has been send to your email</p>
                                                        </div>
                                                        <SohoButton
                                                            style={{ marginLeft: 'auto', marginRight: 'auto' }}
                                                            value="Go to main page"
                                                            onClick={() => history.push('/list-post')}
                                                        />
                                                    </>
                                                )}
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