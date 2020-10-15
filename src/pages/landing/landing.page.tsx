import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';

function Landing() {
    return (
        <>
            <NavBar />
            <div className="container page-content ">

                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="widget enter_bg">
                                    <div className="list_tab_link">Offering Services? <a
                                        href="https://sohotonight.azurewebsites.net/register.html">Register Here</a></div>

                                    <div className="list_tab">
                                        <h3 style={{ color: "#d32a6b" }}>Welcome Soho Tonight</h3>
              Soho Tonight is committed to providing a safe and anonymous environment where individuala can distribute
              and market their own adult products, services and content. Those who seek to avail themselves of such
              services can maintain their requirem offer with ease

            </div>
                                    <div className="widget-header">
                                        <span className="widget-caption" style={{ fontSize: "17px" }}><strong>Warning</strong></span>
                                    </div>
                                    <div className="widget-body">
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
                    that sxists within this website.</li>

                                                <li>This website uses cookies and you permit them to be stored on your devices.</li>

                                                <li>You have read and accept the Privecy Policy Website Use Policy and User Agreement.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="enter_contener">
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" />
                                            <span className="text">I agree I am 18+ years of age.</span>
                                        </label>
                                    </div>


                                    <ul>
                                        <li><a href="https://sohotonight.azurewebsites.net/list_posts.html">Continue</a></li>

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
