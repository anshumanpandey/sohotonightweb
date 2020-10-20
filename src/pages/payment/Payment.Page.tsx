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
import StepWizard from 'react-step-wizard';
import SohoButton from '../../partials/SohoButton';

const stepDict = [
    "Personal Data",
    "Pay"
]

const Nav = (props: any) => {
    const dots = [];
    for (let i = 1; i <= props.totalSteps; i += 1) {
        const isActive = props.currentStep === i;
        dots.push((
            <div style={{ width: '10rem', display: "flex", flexDirection: "column", alignItems: 'center' }}>
                <i
                    className={`fa ${isActive ? 'fa-dot-circle-o' : "fa-circle"}`}
                    aria-hidden="true"
                    key={`step-${i}`}
                    style={{ fontSize: '2.5rem', color: '#ce2f6b' }}
                />
                <p>{stepDict[i - 1]}</p>
            </div>
        ));
    }

    return (
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>{dots}</div>
    );
};

const StepOne = ({ formik, history, ...props }: any) => {
    const nextDisabled = !formik.values.name || !formik.values.email || !formik.values.address
    return (
        <>
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
            <div style={{ display: 'flex', justifyContent: "space-between", width: "15%", marginLeft: "auto" }} className="form-group">
                <SohoButton value="Back to Profile" onClick={(e) => { e.preventDefault(); history.goBack() }} />
                <SohoButton disabled={nextDisabled} value="Next" onClick={() => props.goToStep(2)} />
            </div>
        </>
    );
}

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


    const StepTwo = ({ history }: any) => {
        return (
            <>
                <div style={{ pointerEvents: disablePaymentButton() ? 'none' : 'unset', opacity: disablePaymentButton() ? 0.4 : 1, width: '30%', margin: 'auto' }}>
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
                            clientId: "Ad_1yqkg40dYYOkw1oWZLkl0L_RKHEnGgklSB2fG33FzKrtJoPV8QIg_olt4npLOrpBXfukUARdretzX",
                            currency: 'GBP'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: "space-between", width: "20%", marginLeft: "auto" }} className="form-group">
                    <SohoButton value="Back to Profile" onClick={(e) => { e.preventDefault(); history.goBack() }} />
                </div>
            </>
        );
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
                                            <div>
                                                <StepWizard nav={<Nav />}>
                                                    <StepOne formik={formik} history={history} />
                                                    <StepTwo history={history} />
                                                </StepWizard>
                                            </div>
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