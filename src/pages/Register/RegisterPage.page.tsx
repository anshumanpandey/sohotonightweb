import React, { useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import SohoLoginForm from '../../partials/SohoLoginForm';
import { Formik } from 'formik';
import country from 'country-list-js';
import * as Yup from 'yup';
import useAxios from 'axios-hooks'
import ErrorLabel from '../../partials/ErrorLabel';
import "../../css/login_register.css"
import { Redirect } from 'react-router-dom';
import { dispatchGlobalState, GLOBAL_STATE_ACIONS } from '../../state/GlobalState';

const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function LoginPage() {
    const [registered, setRegistered] = useState(false)
    const formInitialValues = {
        nickname: '',
        password: '',
        confirmPassword: '',
        emailAddress: '',
        dayOfBirth: '',
        monthOfBirth: '',
        yearOfBirth: '',
        country: '',

        escortServices: false,
        phoneChat: false,
        webcamWork: false,
        contentProducer: false,

        acceptPolicies: false,
        recievePromotions: false,
    }
    const validationSchema = Yup.object().shape({
        nickname: Yup.string().required('Required'),
        password: Yup.string().required('Required')
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
        confirmPassword: Yup.string()
            .required('Required')
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        emailAddress: Yup.string().email('Invalid email').required('Required'),
        dayOfBirth: Yup.string().required('Required'),
        monthOfBirth: Yup.string().required('Required'),
        yearOfBirth: Yup.string().required('Required'),
        acceptPolicies: Yup.boolean().oneOf([true], "Must Accept Concent"),
    });

    const [{ data, loading, error }, doRegister] = useAxios({ url: '/user/register', method: 'POST'}, { manual: true });
    const [loginReq, doLogin] = useAxios({ url: '/user/login', method: 'POST'}, { manual: true });


    if (registered) {
        return <Redirect to="/profile-edit" />
    }

    return (
        <>
            <NavBar />
            <div className="container page-content ">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <div className="widget-header">
                                        <span className="widget-caption">Login</span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                            <SohoLoginForm />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <div className="widget">
                                    <div className="widget-header">
                                        <span className="widget-caption">Register</span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                            <Formik
                                                initialValues={formInitialValues}
                                                validationSchema={validationSchema}
                                                onSubmit={(data, { setStatus }) => {
                                                    doRegister({ data })
                                                    .then(() => doLogin({ data: { nickname: data.nickname, password: data.password }}))
                                                    .then(({ data }) => {
                                                        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.JWT_TOKEN, payload: data.token})
                                                        dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.USER_DATA, payload: data})
                                                    })
                                                    .then(() => setRegistered(true))
                                                }}
                                            >
                                                {({
                                                    values,
                                                    errors,
                                                    touched,
                                                    status,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    /* and other goodies */
                                                }) => (
                                                        <div> 
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
                                                            {errors.nickname && touched.nickname && <ErrorLabel message={errors.nickname} />}
                                                            <div className="form-group">
                                                                <label htmlFor="sminput">Password</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control input-sm"
                                                                    placeholder="Password"
                                                                    name="password"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.password}
                                                                />
                                                            </div>
                                                            {errors.password && touched.password && <ErrorLabel message={errors.password} />}
                                                            <div className="form-group">
                                                                <label htmlFor="definpu">Confirm Password</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Confirm Password"
                                                                    name="confirmPassword"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.confirmPassword}
                                                                />
                                                            </div>
                                                            {errors.confirmPassword && touched.confirmPassword && <ErrorLabel message={errors.confirmPassword} />}
                                                            <div className="form-group">
                                                                <label htmlFor="lginput">Email Address</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Email Address"
                                                                    name="emailAddress"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.emailAddress}
                                                                />
                                                            </div>
                                                            {errors.emailAddress && touched.emailAddress && <ErrorLabel message={errors.emailAddress} />}

                                                            <div className="form-group">
                                                                <label htmlFor="xlginput">Date Of Birth</label>
                                                                <div className="row">
                                                                    <div className="col-md-4 col-sm-4 col-xs-12">
                                                                        <select
                                                                            style={{ width: "100%" }}
                                                                            name={"dayOfBirth"}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.dayOfBirth}
                                                                        >
                                                                            <option>Day</option>
                                                                            {Array(31).fill(0).map((_, idx) => {
                                                                                return <option value={idx + 1}>{idx + 1}</option>
                                                                            })}
                                                                        </select>
                                                                        {errors.dayOfBirth && touched.dayOfBirth && <ErrorLabel message={errors.dayOfBirth} />}
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4 col-xs-12">
                                                                        <select
                                                                            style={{ width: "100%" }}
                                                                            name={"monthOfBirth"}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.monthOfBirth}
                                                                        >
                                                                            <option>Month</option>
                                                                            {monthArray.map((mont, idx) => {
                                                                                return <option value={mont}>{mont}</option>
                                                                            })}
                                                                        </select>
                                                                        {errors.monthOfBirth && touched.monthOfBirth && <ErrorLabel message={errors.monthOfBirth} />}
                                                                    </div>
                                                                    <div className="col-md-4 col-sm-4 col-xs-12">
                                                                        <select
                                                                            style={{ width: "100%" }}
                                                                            name={"yearOfBirth"}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.yearOfBirth}
                                                                        >
                                                                            <option>Year</option>
                                                                            {Array(50).fill(0).map((_, idx) => {
                                                                                return (
                                                                                    <option value={new Date().getFullYear() - idx}>
                                                                                        {new Date().getFullYear() - idx}
                                                                                    </option>
                                                                                );
                                                                            })}
                                                                        </select>
                                                                        {errors.yearOfBirth && touched.yearOfBirth && <ErrorLabel message={errors.yearOfBirth} />}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <h5>Privacy & Legal</h5>

                                                            <div className="row">


                                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="checkbox">
                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                name={"acceptPolicies"}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                checked={values.acceptPolicies}
                                                                            />
                                                                            <span className="text">I accept and consert to the Site's
        <a href="#">Policies and User Agreement</a></span>
                                                                        </label>
                                                                    </div>
                                                                    {errors.acceptPolicies && touched.acceptPolicies && <ErrorLabel message={errors.acceptPolicies} />}
                                                                </div>
                                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="checkbox">
                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                name={"recievePromotions"}
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                checked={values.recievePromotions}
                                                                            />
                                                                            <span className="text">I am happy to receive promotional emails,
You can change this seatting at any time</span>
                                                                        </label>
                                                                    </div>
                                                                </div>


                                                            </div>


                                                            <div className="form-group">
                                                                <input onClick={() => handleSubmit()} type="button" value="Submit" />
                                                            </div>

                                                        </div>

                                                    )}
                                            </Formik>
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
export default LoginPage;