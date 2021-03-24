import React, { useState } from 'react';
import { Formik } from 'formik';
import useAxios from 'axios-hooks'
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, updateCallRequestToken, useGlobalState } from '../state/GlobalState';
import { Redirect } from 'react-router-dom';
import SohoButton from './SohoButton';
import ErrorLabel from './ErrorLabel';
import { UseTwilioVoiceCall } from '../utils/UseTwilioVoiceCall';
import { startSocketConnection } from '../request/socketClient';

function SohoLoginForm({ disabled }: { disabled?: boolean }) {
    const [redirect, setRedirect] = useState<boolean>(false)
    const [userData] = useGlobalState("userData")
    const [{ data, loading, error }, doLogin] = useAxios({ url: '/user/login', method: 'POST' }, { manual: true });
    const call = UseTwilioVoiceCall()

    if (redirect && userData) {
        if (userData.role == "MODEL") return <Redirect to="/profile-edit" />
        if (userData.role == "USER") return <Redirect to="/payment" />
    }

    return (
        <Formik
            initialValues={{ nickname: '', password: '' }}
            validate={values => {
                const errors: any = {};
                if (!values.nickname) {
                    errors.nickname = 'Required';
                }
                if (!values.password) {
                    errors.password = 'Required';
                }
                return errors;
            }}
            onSubmit={(data, { setSubmitting }) => {
                doLogin({ data })
                    .then(({ data }) => {
                        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.JWT_TOKEN, payload: data.token })
                        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.USER_DATA, payload: data })
                        return call.requestToken({ identity: data.nickname })
                    })
                    .then(token => updateCallRequestToken(token))
                    .then(() => setRedirect(true))
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
            }) => (
                    <div role="form">
                        <div className="form-group">
                            <label htmlFor="xsinput">Nickname</label>
                            <input
                                type="text"
                                className="form-control input-sm"
                                placeholder="Nickname"
                                name="nickname"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.nickname}
                            />
                            {errors.nickname && touched.nickname && <ErrorLabel message={errors.nickname.toString()} />}
                        </div>
                        <div className="form-group">
                            <label htmlFor="sminput">Password</label>
                            <input
                                type="password"
                                className="form-control input-sm"
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                            {errors.password && touched.password && <ErrorLabel message={errors.password.toString()} />}
                        </div>
                        <SohoButton disabled={disabled} style={{ marginLeft: 'auto' }} onClick={() => handleSubmit()} value={"Login"} />
                    </div>
                )}
        </Formik>
    );
}
export default SohoLoginForm;
