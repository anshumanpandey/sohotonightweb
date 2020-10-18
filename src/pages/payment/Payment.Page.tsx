import { useFormik } from 'formik';
import React from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import { PayPalButton } from "react-paypal-button-v2";
import { SavePayment } from '../../request/paypal.requests';
import ErrorLabel from '../../partials/ErrorLabel';
import { GetPriceForAsset } from '../../request/file.request';
import { useHistory, useParams } from 'react-router-dom';
import { setInfoAlert, setSuccessAlert } from '../../state/GlobalState';

function PaymentPage() {
    const { type, id } = useParams<any>()
    const history = useHistory()

    const [paymentReq, doSave] = SavePayment()
    const [assetReq] = GetPriceForAsset({ type, id })

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            address: '',
        },
        onSubmit: values => {

        },
        validate: values => {
            const errors: any = {}

            if (!values.name) errors.name = "Required"
            if (!values.email) errors.email = "Required"
            if (!values.address) errors.address = "Required"

            return errors
        }
    });

    const disablePaymentButton = () => {
        return Object.keys(formik.errors).length != 0 || Object.keys(formik.touched).length != 3 || formik.dirty == false
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
                                    <div className="widget-header">
                                        <span className="widget-caption" style={{ fontSize: "18px" }}><strong>Payment Info</strong></span>
                                    </div>
                                    <div className="widget-body">
                                        <div className="collapse in">
                                            <form action="">
                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Name :</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{ borderRadius: "4px" }}
                                                            placeholder="name"
                                                            name="name"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.name}
                                                        />
                                                        {formik.errors.name && formik.touched.name && <ErrorLabel message={formik.errors.name} />}
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Email :</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Email"
                                                            style={{ borderRadius: "4px" }}
                                                            name="email"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.email}
                                                        />
                                                        {formik.errors.email && formik.touched.email && <ErrorLabel message={formik.errors.email} />}
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Address :</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{ borderRadius: "4px" }}
                                                            placeholder="address"
                                                            name="address"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.address}
                                                        />
                                                        {formik.errors.address && formik.touched.address && <ErrorLabel message={formik.errors.address} />}
                                                    </div>
                                                </div>

                                                <div style={{ pointerEvents: disablePaymentButton() ? 'none': 'unset', opacity: disablePaymentButton() ? 0.4: 1,width: '30%', margin: 'auto'}}>
                                                    <PayPalButton
                                                        amount={assetReq?.data?.price || 0}
                                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                        onSuccess={(details: any, data: any) => {
                                                            doSave({ data: { ...formik.values, transactionId: data.orderID } })
                                                            .then(() => {
                                                                setSuccessAlert("Payment Saved!")
                                                                history.goBack()
                                                            })
                                                        }}
                                                        options={{
                                                            clientId: "AbMaRWKT092Mc_TYD353knc3s-5QZgUX3mHzIaSHzZTvwylHoUX7SyaMFmW24MXcf-0fCBkT4poAlUWf",
                                                            currency: 'GBP'
                                                        }}
                                                    />
                                                </div>
                                            </form>
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
export default PaymentPage;