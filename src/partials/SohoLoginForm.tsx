import React from 'react';
import { Formik } from 'formik';

function SohoLoginForm() {
    return (
        <Formik
            initialValues={{ nickname: '', password: '' }}
            validate={values => {
                const errors: any = {};
                if (!values.nickname) {
                    errors.nickname = 'Required';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.nickname)) {
                    errors.nickname = 'Invalid email address';
                }

                if (!values.password) {
                    errors.password = 'Required';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                }, 400);
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
                                type="text"
                                className="form-control input-sm"
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                        </div>

                        <div className="form-group">
                            <input type="button" value="Submit" />
                        </div>
                    </div>
                )}
        </Formik>
    );
}
export default SohoLoginForm;
