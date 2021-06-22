import { useFormik } from 'formik';
import React from 'react';
import ErrorLabel from '../../partials/ErrorLabel';
import * as Yup from 'yup';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import SohoButton from '../../partials/SohoButton';
import useAxios from 'axios-hooks';
import { useState } from 'react';
import { BrandColor } from '../../utils/Colors';
import SohoLoader from '../../partials/SohoLoader';

function ForgotPassword() {
    const [sendedEmail, setSendedEmail] = useState(false);
    const [{ data, loading }, doSend] = useAxios({ url: '/auth/resetPassword', method: 'POST' }, { manual: true });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validateOnChange: true,
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Required'),
        }),
        onSubmit: values => {
            doSend({
                data: values
            })
                .then(() => {
                    setSendedEmail(true)
                })
        },
    });

    const btnIsDisabled = () => !formik.isValid || loading

    return (
        <>
            <NavBar />
            <div className="container page-content ">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">

                        <div className="row">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="widget">
                                    <div className="widget-header">
                                        <span className="widget-caption">Forgot Password</span>
                                    </div>
                                    <div className="widget-body">
                                        {sendedEmail && (
                                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                <img src={require("../../img/Photos/logo.png")} />
                                                <h3 style={{ color: BrandColor }}>Thanks!</h3>
                                                <p>An email has been send to {formik.values.email}</p>
                                            </div>
                                        )}
                                        {!sendedEmail && (
                                            <div style={{ position: 'relative' }} className="collapse in">
                                                <SohoLoader show={loading} />
                                                <div role="form">
                                                    <div className="form-group">
                                                        <label htmlFor="xsinput">Email</label>
                                                        <input
                                                            autoCapitalize="none"
                                                            type="text"
                                                            className="form-control input-sm"
                                                            placeholder="Email"
                                                            name="email"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.email}
                                                        />
                                                        {formik.errors.email && formik.touched.email && <ErrorLabel message={formik.errors.email.toString()} />}
                                                    </div>
                                                    <SohoButton disabled={btnIsDisabled()} style={{ marginLeft: 'auto' }} onClick={formik.handleSubmit} value={"Send"} />
                                                </div>
                                            </div>
                                        )}
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
export default ForgotPassword;