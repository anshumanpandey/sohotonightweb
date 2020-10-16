import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, useGlobalState } from '../../state/GlobalState';

function ComingSoon() {
    const [above18, setAbove18] = useState(false);
    const [isAbove18] = useGlobalState("above18")

    if (isAbove18) {
        return <Redirect to="list-post" />
    }
    return (
        <>
            <div className="container page-content ">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="widget">
                                    <div className="">
                                        <h1 style={{ color: "#d32a6b" }}>Welcome Soho Tonight</h1>
                                        <h3 style={{ color: "#d32a6b" }}>Coming Soon</h3>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ComingSoon;
