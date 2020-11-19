import React, { useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import useAxios from 'axios-hooks'
import { BrandColor } from '../../utils/Colors';
import { setSelectedTown, useGlobalState } from '../../state/GlobalState';
import { Redirect } from 'react-router-dom';

function RegionsPage() {
    const [redirect, setRedirect] = useState(false);

    const [{ data, loading, error }, getUser] = useAxios({
        url: '/user/public/userPerRegion',
    });

    if (redirect) {
        return <Redirect to="list-post" />
    }

    return (
        <>
            <NavBar />
            <div className="container page-content ">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="widget">
                                    <div style={{ minHeight: '60vh',alignItems: 'center',display: 'flex',justifyContent: 'space-around', flexDirection: 'row' }} className="widget-body">
                                        {data?.map((e: any) => {
                                            return <div
                                                style={{ fontSize: 18, color: BrandColor, cursor: 'pointer' }}
                                                onClick={() => {
                                                    setSelectedTown(e.town)
                                                    setRedirect(true)
                                                }}
                                            >{e.town} ({e.amount})</div>
                                        })}
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
export default RegionsPage;