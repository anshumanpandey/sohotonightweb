import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useAxios from 'axios-hooks'
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, setJustRegistered, useGlobalState } from '../../state/GlobalState';
import { disconnectSocket } from '../../request/socketClient';

function LogoutPage() {
    const [userData] = useGlobalState("userData")
    const [{ data, loading, error }, logout] = useAxios({
        url: '/user/logout',
        method: 'POST'
    }, { manual: true });

    useEffect(() => {
        logout()
        .then(() => {
            dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.LOGOUT })
            disconnectSocket()
            setJustRegistered(false)
        })
    }, [])

    if (!userData) {
        return <Redirect to="/register" />
    }
    return (<></>);
}

export default LogoutPage;
