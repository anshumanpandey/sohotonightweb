import React, { useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import SohoButton from '../../partials/SohoButton';
import { UseTwilioVoiceCall } from '../../utils/UseTwilioVoiceCall';

function CallTest() {
    const [callerName, setCallerName] = useState("Caller1");
    const r = UseTwilioVoiceCall()

    return (
        <>
            <NavBar />
            <div className="container page-content ">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="widget">

                                    <div className="widget-body">


                                        <div className="main-contact-section">

                                            <SohoButton value="Set Caller 1" onClick={() => setCallerName("Caller1")} />
                                            <SohoButton value="Set Caller 2" onClick={() => setCallerName("Caller2")} />
                                            <SohoButton value="Init Call" onClick={() => r.requestCall({ identity: callerName })} />

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
export default CallTest;