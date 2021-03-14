import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, useGlobalState } from '../../state/GlobalState';
import { BrandColor } from '../../utils/Colors';
import UseIsLess1200Res from '../../utils/UseIsLess1200Res';
import { UseTwilioVoiceCall } from '../../utils/UseTwilioVoiceCall';


function Landing() {
    const [above18, setAbove18] = useState(false);
    const [continueBtn, setContinueBtn] = useState(false);
    const isMobile = UseIsLess1200Res();

    if (above18 && continueBtn) {
        return <Redirect to="/list-post" />
    }
    return (
        <>
            <NavBar />
            <div style={{ marginTop: isMobile ? '140px': '70px'}} className="container page-content" >

                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="widget">
                                    <div className="list_tab_link">Offering Services? <Link to="/register">Register Here</Link></div>

                                    <div className="">
                                        <h3 style={{ color: "#d32a6b" }}>Welcome Soho Tonight</h3>
              Soho Tonight is committed to providing a safe and anonymous environment where individuala can distribute
              and market their own adult products, services and content. Those who seek to avail themselves of such
              services can maintain their requirem offer with ease

            </div>
                                    <div style={{ background: 'unset' }} className="widget-header">
                                        <span className="widget-caption" style={{ fontSize: "17px" }}><strong>Warning</strong></span>
                                    </div>
                                    <div style={{ background: 'unset' }} className="widget-body">
                                        <div className="collapse in warning_list">
                                            <p>Soho Tonight contains material of an adult nature relating to entertainment services.</p>

                                            <p>By entering this adult services website, you are confirming and consenting that:</p>

                                            <ul>
                                                <li>You are of legal adult age, as defined by the country or state from where you are accessing this
                    website, to view sexually explicit and pornographic material.</li>

                                                <li>You are accessing this website from a country or state where it is legal to enter adult website
                    or view sexually explicit and pornographic material.</li>

                                                <li>You are not offended by nudity, sexual imagery or any sexual activity.</li>

                                                <li>You will not permit any minor, or other person for who it is illegal, to access or view material
                    that exist within this website.</li>

                                                <li>This website uses cookies and you permit them to be stored on your devices.</li>

                                                <li>You have read and accept the Privecy Policy Website Use Policy and User Agreement.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="enter_contener">
                                    <div className="checkbox" style={{ display: "flex", flexDirection: "column" }}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={above18}
                                                onChange={() => {
                                                    setAbove18(!above18)
                                                }} />
                                            <span className="text">
                                                I agree I am 18+ years of age and I accept the
                                                <Link style={{ color: BrandColor }} to={"/userAgreement"}>
                                                    {" "}User agreeement{" "}
                                                </Link>
                                                and
                                                <Link style={{ color: BrandColor }} to={"/webUserAgreement"}>
                                                    {" "}Web user agreement.
                                                </Link>
                                        </span>
                                        </label>
                                    </div>


                                    <ul>
                                        <li style={{ pointerEvents: above18 ? undefined : "none", cursor: above18 ? 'pointer' : "not-allowed" }}>
                                            <a href="#" onClick={() => {
                                                dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.ABOVE_18, payload: above18 })
                                                setContinueBtn(true)
                                            }}>
                                                Continue
                                            </a>
                                        </li>
                                    </ul>

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

export default Landing;
