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
import countries from "../../utils/countries.json"

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
    const nextDisabled = Object.keys(formik.values).some(k => !formik.values[k])
    return (
        <>
            <div className="form-group row">
                <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">First Name :</label>
                <div className="col-sm-10 col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: "4px" }}
                        placeholder="First Name"
                        name="firstName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                    />
                    {formik.errors.firstName && formik.touched.firstName && <ErrorLabel message={formik.errors.firstName} />}
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Last Name :</label>
                <div className="col-sm-10 col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: "4px" }}
                        placeholder="Last Name"
                        name="lastName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                    />
                    {formik.errors.lastName && formik.touched.lastName && <ErrorLabel message={formik.errors.lastName} />}
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Address 1 :</label>
                <div className="col-sm-10 col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: "4px" }}
                        placeholder="Address 1"
                        name="addressOne"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.addressOne}
                    />
                    {formik.errors.addressOne && formik.touched.addressOne && <ErrorLabel message={formik.errors.addressOne} />}
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Address 2 :</label>
                <div className="col-sm-10 col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: "4px" }}
                        placeholder="Address 2"
                        name="addressTwo"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.addressTwo}
                    />
                    {formik.errors.addressTwo && formik.touched.addressTwo && <ErrorLabel message={formik.errors.addressTwo} />}
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">City :</label>
                <div className="col-sm-10 col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: "4px" }}
                        placeholder="City"
                        name="city"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.city}
                    />
                    {formik.errors.city && formik.touched.city && <ErrorLabel message={formik.errors.city} />}
                </div>
            </div>

            <div className="form-group row">
                <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Country :</label>
                <div className="col-sm-10 col-md-6">
                    <select
                        style={{ width: "100%" }}
                        className="form-control"
                        name={"country"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.country}
                    >
                        <option>Select</option>
                        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                    {formik.errors.country && formik.touched.country && <ErrorLabel message={formik.errors.country} />}
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
            firstName: '',
            lastName: '',
            addressOne: '',
            addressTwo: '',
            city: '',
            country: '',
            email: '',
        },
        onSubmit: values => {

        },
        validate: values => {
            const errors: any = {}

            if (!values.firstName) errors.firstName = "Required"
            if (!values.lastName) errors.lastName = "Required"
            if (!values.addressOne) errors.addressOne = "Required"
            if (!values.addressTwo) errors.addressTwo = "Required"
            if (!values.city) errors.city = "Required"
            if (!values.country) errors.country = "Required"
            if (!values.email) errors.email = "Required"

            return errors
        }
    });

    const disablePaymentButton = () => {
        //@ts-expect-error
        return Object.keys(formik.values).some(k => !formik.values[k])
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