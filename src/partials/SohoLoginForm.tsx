import React, { useState } from 'react';
import { Formik } from 'formik';
import useAxios from 'axios-hooks'
import { dispatchGlobalState, GLOBAL_STATE_ACIONS } from '../state/GlobalState';
import { Redirect } from 'react-router-dom';
import SohoButton from './SohoButton';

function SohoLoginForm() {
    const [redirect, setRedirect] = useState(false)
    const [{ data, loading, error }, doLogin] = useAxios({ url: '/user/login', method: 'POST'}, { manual: true });

    if (redirect) {
        return <Redirect to="list-post" />
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
                    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.JWT_TOKEN, payload: data.token})
                    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.USER_DATA, payload: data})
                    setRedirect(true)
                })
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
                        </div>
                        <SohoButton onClick={() => handleSubmit()} value={"Login"} />
                    </div>
                )}
        </Formik>
    );
}
export default SohoLoginForm;
