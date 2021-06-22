import { useFormik } from 'formik';
import React from 'react';
import ErrorLabel from '../../partials/ErrorLabel';
import * as Yup from 'yup';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import SohoButton from '../../partials/SohoButton';
import { Redirect } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useState } from 'react';
import { BrandColor } from '../../utils/Colors';
import SohoLoader from '../../partials/SohoLoader';
import { UseQuery } from '../../hooks/UseQuery';

function SetupPassword() {
    const query = UseQuery();
    const [redirectTo, setRedirectTo] = useState<string>("")
    const [sendedEmail, setSendedEmail] = useState(false);
    const [{ data, loading }, doSend] = useAxios({ url: '/auth/completePassword', method: 'POST' }, { manual: true });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validateOnChange: true,
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            password: Yup
            .string()
            .required('Please Enter your password')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$_!%*#?&])[A-Za-z\d@$!%*#_?&]{8,}$/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
            ),
            confirmPassword: Yup.string()
                .required('Required')
                .oneOf([Yup.ref('password')], 'Passwords must match'),
        }),
        onSubmit: values => {
            doSend({
                data: {
                    ...values,
                    code: query.get('code')
                }
            })
                .then(() => {
                    setSendedEmail(true)
                    setTimeout(() => {
                        setRedirectTo('register')
                    }, 4 * 1000 )
                })
        },
    });

    const btnIsDisabled = () => !formik.isValid || loading

    if (redirectTo) return <Redirect to={`${redirectTo}`} />

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
                                        <span className="widget-caption">Reset Password</span>
                                    </div>
                                    <div className="widget-body">
                                        {sendedEmail && (
                                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                <img src={require("../../img/Photos/logo.png")} />
                                                <h3 style={{ color: BrandColor }}>Thanks!</h3>
                                                <p>Your password was reset successfully!</p>
                                            </div>
                                        )}
                                        {!sendedEmail && (
                                            <>
                                                <div style={{ position: 'relative' }} className="collapse in">
                                                    <SohoLoader show={loading} />
                                                    <div role="form">
                                                        <div className="form-group">
                                                            <label htmlFor="xsinput">Password</label>
                                                            <input
                                                                type="password"
                                                                className="form-control input-sm"
                                                                placeholder="Password"
                                                                name="password"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.password}
                                                            />
                                                            {formik.errors.password && formik.touched.password && <ErrorLabel message={formik.errors.password.toString()} />}
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="definpu">Confirm Password</label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="Confirm Password"
                                                                name="confirmPassword"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.confirmPassword}
                                                            />
                                                        </div>
                                                        {formik.errors.confirmPassword && formik.touched.confirmPassword && <ErrorLabel message={formik.errors.confirmPassword} />}
                                                        <SohoButton disabled={btnIsDisabled()} style={{ marginLeft: 'auto' }} onClick={formik.handleSubmit} value={"Send"} />
                                                    </div>
                                                </div>
                                            </>
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
export default SetupPassword;