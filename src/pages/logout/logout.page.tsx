import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, useGlobalState } from '../../state/GlobalState';

function LogoutPage() {
    const [userData] = useGlobalState("userData")

    useEffect(() => {
        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.LOGOUT })
    }, [])

    if (!userData) {
        return <Redirect to="/preview" />
    }
    return (<></>);
}

export default LogoutPage;
