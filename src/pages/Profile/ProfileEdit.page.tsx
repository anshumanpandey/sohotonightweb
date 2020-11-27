import React, { useRef, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/ProfileEdit.css';
import '../../css/cover.css';
import '../../css/timeline.css';
import { dispatchGlobalState, GLOBAL_STATE_ACIONS, useGlobalState } from '../../state/GlobalState';
import { useFormik } from 'formik';
import useAxios from 'axios-hooks'
import UkCounties from "../../utils/UkCounties.json"
import { Redirect } from 'react-router-dom';
import DatePicker, { DateInput } from '@trendmicro/react-datepicker';
import '@trendmicro/react-datepicker/dist/react-datepicker.css';
import Dropdown from '@trendmicro/react-dropdown';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import moment from 'moment';
import ErrorLabel from '../../partials/ErrorLabel';
import UkLocationsDropdown from '../../partials/UkLocationsDropdown';
import ServicesDropdown from '../../partials/ServicesDropdown';
import UseIsMobile from '../../utils/UseIsMobile';

var months: { [k: string]: string } = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
}

const getServicesList = (option: any, currentValues: any[]) => {
    const found = currentValues.find((val: any) => val.id == option.id)
    if (found) {
        return currentValues.filter(v => v.id != option.id)
    } else {
        return [...currentValues, option]
    }
}

function ProfileEditPage() {
    const bannerRef = useRef<HTMLImageElement | null>(null)
    const [profile] = useGlobalState('userData')
    const [currentTab, setCurrentTab] = useState(0)
    const [redirect, setRedirect] = useState(false)
    const isMobile = UseIsMobile();

    const [{ data, loading, error }, updateProfile] = useAxios({
        url: '/user/update',
        method: 'PUT',
    }, { manual: true });

    const [servicesReq, getServices] = useAxios({
        url: '/services/',
    });

    const formik = useFormik({
        initialValues: {
            ...profile,
            birthDate: new Date(`${profile.yearOfBirth}/${months[profile.monthOfBirth]}/${profile.dayOfBirth}`),
            bannerImagePreview: profile.bannerImage,
            profileImagePreview: profile.profilePic,
            authenticationProfilePicPreview: profile.authenticationProfilePic,
        },
        validate: values => {
            const errors: any = {};
            if (values.aboutYouDetail && values.aboutYouDetail.split(' ').length < 20) {
                errors.aboutYouDetail = 'Must be at least 20 words';
            }

            if (currentTab == 0) {
                if (!values.firstName) errors.firstName = 'Required';
                if (!values.lastName) errors.lastName = 'Required';
                if (!values.town) errors.town = 'Required';
            }

            return errors;
        },
        onSubmit: values => {
            const {
                bannerImagePreview,
                profileImagePreview,
                authenticationProfilePicPreview,
                profileImageFile,
                bannerImageFile,
                authenticationProfilePic,
                Services,
                ...fields
            } = values

            const data = new FormData();

            if (profileImageFile) data.append("profilePic", profileImageFile)
            if (bannerImageFile) data.append("bannerImage", bannerImageFile)
            if (authenticationProfilePic) data.append("authenticatePic", authenticationProfilePic)
            if (Services.length != 0) {
                data.append("Services", Services.map((s: any) => s.id).join(","))
            }
            Object.keys(fields).forEach(k => {
                if (values[k]) {
                    data.append(k, values[k])
                }
            })

            updateProfile({ data })
                .then(({ data }) => {
                    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.JWT_TOKEN, payload: data.token })
                    dispatchGlobalState({ type: GLOBAL_STATE_ACIONS.USER_DATA, payload: data })

                    if (currentTab == 0) setCurrentTab(1)
                    if (currentTab == 1) setCurrentTab(2)
                    if (currentTab == 2) setRedirect(true)
                })
        },
    });

    if (redirect) {
        return <Redirect to={`/profile/${profile.id}`} />
    }

    return (
        <>
            <NavBar />
            <div className="container page-content">
                <div className="row" id="user-profile">
                    <div className="col-md-12 col-xs-12">
                        <div className="row-xs">
                            <div className="main-box clearfix">

                                <div className="tabs-wrapper profile-tabs">
                                    <ul className="nav nav-tabs">
                                        <li className={currentTab == 0 ? "active" : undefined}>
                                            <a onClick={() => setCurrentTab(0)} href="#general" data-toggle="tab">General</a>
                                        </li>
                                        <li className={currentTab == 1 ? "active" : undefined}>
                                            <a onClick={() => setCurrentTab(1)} href="#personal-details" data-toggle="tab">Personal Details</a>
                                        </li>
                                        <li className={currentTab == 2 ? "active" : undefined}>
                                            <a onClick={() => setCurrentTab(2)} href="#media" data-toggle="tab">Media</a>
                                        </li>
                                    </ul>

                                    <div className="tab-content">
                                        <div className={`tab-pane ${currentTab == 0 ? "fade in active" : undefined}`} id="general">
                                            <div>
                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: "0 0 7px 0", fontWeight: "bold" }}>
                                                    Contact Details</h5>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">First Name:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="firstName"
                                                            placeholder="First Name"
                                                            value={formik.values.firstName}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                    {formik.errors.firstName && formik.touched.firstName && <ErrorLabel message={formik.errors.firstName.toString()} />}
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Last Name:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="lastName"
                                                            placeholder="Last Name"
                                                            value={formik.values.lastName}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                    {formik.errors.lastName && formik.touched.lastName && <ErrorLabel message={formik.errors.lastName.toString()} />}
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Nickname:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            className="form-control-plaintext"
                                                            name="nickname"
                                                            style={{ border: "0px", width: '100%' }}
                                                            value={formik.values.nickname}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Password:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input type="password" readOnly className="form-control-plaintext" style={{ border: "0px", width: '100%' }} value="Password:" />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Email Address</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input type="text" readOnly className="form-control-plaintext" id=""
                                                            value={formik.values.emailAddress} style={{ border: "0px", width: '100%' }} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Mobile/Cell Number:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="phoneNumber"
                                                            placeholder="Mobile/Cell Number"
                                                            value={formik.values.phoneNumber}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                </div>

                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: "0 0 7px 0", fontWeight: "bold" }}>
                                                    Location Details</h5>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Town:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <UkLocationsDropdown
                                                            className="form-control"
                                                            name="town"
                                                            placeholder="Town"
                                                            value={formik.values.town}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                    {formik.errors.town && formik.touched.town && <ErrorLabel message={formik.errors.town.toString()} />}
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Post Code:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="postCode"
                                                            placeholder="Post Code"
                                                            value={formik.values.postCode}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Nearest Rail/Tube Station:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="railStation"
                                                            placeholder="Nearest Rail/Tube Station"
                                                            value={formik.values.railStation}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                </div>

                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: '0 0 7px 0', fontWeight: "bold" }}>
                                                    Services</h5>

                                                <div className="form-group row">
                                                    <div className="col-sm-2 col-md-offset-2 col-form-label">Services:</div>
                                                    <div className="col-sm-10 col-md-6" style={{ display: 'flex', flexWrap: 'wrap', alignItems: "flex-end" }}>
                                                        {servicesReq?.data?.map((s: any) => {
                                                            return (
                                                                <div key={s.name} className="checkbox" style={{ width: '33%', height: '34px'}}>
                                                                    <label>
                                                                        <input
                                                                            type="checkbox"
                                                                            onChange={() => {
                                                                                const servicesState = getServicesList(s, formik.values.Services)
                                                                                formik.setFieldValue("Services", servicesState)
                                                                            }}
                                                                            checked={formik.values.Services.find((currentSer: any) => currentSer.id == s.id)}
                                                                        />
                                                                        <span className="text">{s.name}</span>
                                                                    </label>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>


                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: '0 0 7px 0', fontWeight: "bold" }}>
                                                    Other Setting</h5>

                                                <div className="form-group row">
                                                    <div className="col-sm-2 col-md-offset-2 col-form-label">Allow Social marketing:</div>
                                                    <div className="col-sm-10 col-md-6">
                                                        <div className="checkbox">
                                                            <label>
                                                                <input
                                                                    type="checkbox"
                                                                    name={"allowSocialMediaMarketing"}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.allowSocialMediaMarketing}
                                                                />
                                                                <span className="text">Allow My Profile</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <div className="col-sm-2 col-md-offset-2 col-form-label">Interested in Phone Chat? </div>
                                                    <div className="col-sm-10 col-md-6">
                                                        <div className="radio">
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name={"phoneChat"}
                                                                    value={1}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.phoneChat == true}
                                                                />
                                                                <span className="text">Yes</span>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    name={"phoneChat"}
                                                                    value={0}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.phoneChat == false}
                                                                />
                                                                <span className="text">No</span>
                                                            </label>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', width: isMobile ? "unset":"25%", marginLeft: isMobile ? "unset":'auto', justifyContent: "space-between" }}>
                                                    <div style={{ textAlign: "right" }}>
                                                        <input onClick={() => setRedirect(true)} type="submit" value="Go To Profile" className="form_btn" />
                                                    </div>

                                                    <div style={{ textAlign: "right" }}>
                                                        <input onClick={() => formik.handleSubmit()} type="submit" value="Save and Next" className="form_btn" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`tab-pane ${currentTab == 1 ? "fade in active" : undefined}`} id="personal-details">
                                            <div>
                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: "0 0 7px 0", fontWeight: "bold" }}>
                                                    Personal Information</h5>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Date of Birth:</label>
                                                    <div className="col-sm-10 col-md-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="phoneNumber"
                                                            placeholder="Mobile/Cell Number"
                                                            disabled={true}
                                                            value={moment(formik.values.birthDate).format('D/M/YYYY')}
                                                        />

                                                        {formik.errors.birthDate && <ErrorLabel message={formik.errors.birthDate.toString()} />}
                                                    </div>
                                                </div>


                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Gender:</label>
                                                    <div className="col-sm-10 col-md-3">
                                                        <select
                                                            style={{ width: "100%" }}
                                                            className="form-control"
                                                            name={"gender"}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.gender}
                                                        >
                                                            <option>Select</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Couple">Couple</option>
                                                            <option value="Trans">Trans</option>
                                                        </select>
                                                    </div>
                                                </div>


                                                <div className="form-group row">
                                                    <div className="col-sm-2 col-md-offset-2 col-form-label">Orientation:</div>
                                                    <div className="col-sm-10 col-md-6">
                                                        <div className="radio">
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    className="colored-blue"
                                                                    name={"orientation"}
                                                                    value={"Bi-curious"}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.orientation == "Bi-curious"}
                                                                />
                                                                <span className="text">Bi-curious</span>
                                                            </label>
                                                        </div>

                                                        <div className="radio">
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    className="colored-blue"
                                                                    name={"orientation"}
                                                                    value={"Bi-sexual"}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.orientation == "Bi-sexual"}
                                                                />
                                                                <span className="text">Bi-sexual</span>
                                                            </label>
                                                        </div>

                                                        <div className="radio">
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    className="colored-blue"
                                                                    name={"orientation"}
                                                                    value="Gay"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.orientation == "Gay"}
                                                                />
                                                                <span className="text">Gay</span>
                                                            </label>
                                                        </div>

                                                        <div className="radio">
                                                            <label>
                                                                <input
                                                                    type="radio"
                                                                    className="colored-blue"
                                                                    name={"orientation"}
                                                                    value="Straight"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    checked={formik.values.orientation == "Straight"}
                                                                />
                                                                <span className="text">Straight</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Height:</label>
                                                    <div className="col-sm-10 col-md-2">
                                                        <select
                                                            style={{ width: "100%" }}
                                                            className="form-control"
                                                            name={"feet"}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.feet}
                                                        >
                                                            <option>Centimeters</option>
                                                            {Array(60).fill(0).map((_, idx) => {
                                                                return <option key={`${idx}-key`} value={idx + 140}>{idx + 140}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: "0 0 7px 0", fontWeight: "bold" }}>
                                                    About You</h5>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Summary:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Summary"
                                                            name={"aboutYouSummary"}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.aboutYouSummary}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-2 col-md-offset-2 col-form-label">Details:</label>
                                                    <div className="col-sm-10 col-md-6">
                                                        <textarea
                                                            cols={0}
                                                            rows={0}
                                                            className="form-control"
                                                            style={{ height: "100px", resize: "none" }}
                                                            name={"aboutYouDetail"}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.aboutYouDetail}
                                                        ></textarea>
                                                        {formik.errors.aboutYouDetail && formik.touched.aboutYouDetail && <ErrorLabel message={formik.errors.aboutYouDetail.toString()} />}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'row', width: isMobile ? "unset":"25%", marginLeft: isMobile ? "unset":'auto', justifyContent: "space-between" }}>
                                                    <div style={{ textAlign: "right" }}>
                                                        <input onClick={() => setRedirect(true)} type="submit" value="Go To Profile" className="form_btn" />
                                                    </div>

                                                    <div style={{ textAlign: "right" }}>
                                                        <input onClick={() => formik.handleSubmit()} type="submit" value="Save and Next" className="form_btn" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`tab-pane ${currentTab == 2 ? "fade in active" : undefined}`} id="media">
                                            <div >
                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: "0 0 7px 0", fontWeight: "bold" }}>
                                                    Personal Information</h5>
                                                <div className="pic_up_cont">
                                                    <ul>
                                                        <li>Description</li>
                                                        <li>Upload Now</li>
                                                    </ul>
                                                </div>

                                                <div>

                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-sm-1 col-md-offset-1 col-form-label">1.</label>
                                                        <div className="col-sm-10 col-md-2">
                                                            <label htmlFor="" className="col-sm-12 col-form-label">Banner Image</label>
                                                            <label htmlFor="" className="col-sm-12 col-form-label">Max size 1280*480</label>
                                                        </div>
                                                        <div className="col-sm-10 col-md-3">
                                                            {formik.values.bannerImagePreview && (
                                                                <img
                                                                    onLoad={() => console.log(bannerRef?.current?.naturalHeight)} // print 150
                                                                    ref={bannerRef}
                                                                    style={{ height: 100 }}
                                                                    src={formik.values.bannerImagePreview}
                                                                />
                                                            )}
                                                            {formik.errors.bannerImageFile && <ErrorLabel message={formik.errors.bannerImageFile.toString()} />}
                                                        </div>
                                                        <div className="col-sm-10 col-md-4">
                                                            <div className="upload-btn-wrapper">
                                                                <button className="btn">Upload a file</button>
                                                                <input
                                                                    accept="image/*"
                                                                    type="file"
                                                                    name="myfile"
                                                                    onChange={(event) => {
                                                                        if (event.currentTarget.files) {
                                                                            formik.setFieldValue("bannerImageFile", event.currentTarget.files[0]);
                                                                            const src = URL.createObjectURL(event.currentTarget.files[0]);
                                                                            formik.setFieldValue("bannerImagePreview", src);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-sm-1 col-md-offset-1 col-form-label">2.</label>
                                                        <div className="col-sm-10 col-md-2">
                                                            <label htmlFor="" className="col-sm-12 col-form-label">Profile Image</label>
                                                            <label htmlFor="" className="col-sm-12 col-form-label">Recomended size 110*110</label>
                                                        </div>
                                                        <div className="col-sm-10 col-md-3">
                                                            {formik.values.profileImagePreview && (
                                                                <img style={{ height: 100 }} src={formik.values.profileImagePreview} />
                                                            )}
                                                        </div>
                                                        <div className="col-sm-10 col-md-4">
                                                            <div className="upload-btn-wrapper">
                                                                <button className="btn">Upload a file</button>
                                                                <input
                                                                    type="file"
                                                                    name="profileImageFile"
                                                                    onChange={(event) => {
                                                                        if (event.currentTarget.files) {
                                                                            formik.setFieldValue("profileImageFile", event.currentTarget.files[0]);
                                                                            const src = URL.createObjectURL(event.currentTarget.files[0]);
                                                                            formik.setFieldValue("profileImagePreview", src);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p>Use this section to upload some images of yourself. These images are the first that any
                                                        customer will see as they are show in search results and on home pages so you may want to try
                          and use them to entice people to click on your profile</p>

                                                        <p>Please remember not to include images that have contact information, URLs or others sites's
                          watermarks on them</p>

                                                        <p>If your profile pictures are not square, you should specify which area should be used as a
                          square version here.</p>

                                                    </div>

                                                </div>

                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: '0 0 7px 0', fontWeight: "bold" }}>
                                                    Adult Content Certification</h5>

                                                <div>
                                                    <p>Member are strongly encouraged to ensure their Soho Tonight proile is compliant with the laws
                                                    in their county. For more information of what's expected please visit this page. To review your
                        free-to-view content,</p>
                                                </div>

                                                <div className="checkbox">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name={"hasAdultContentCertification"}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            checked={formik.values.hasAdultContentCertification}
                                                        />
                                                        <span className="text">I certify that have reviewed all of the free to view content on my profile
                                                        it's associated pages and have removed any images that are unsuitable for minors. Furthermore,
                          any image I upload to these areas in future will also conform to these standards.</span>
                                                    </label>
                                                </div>


                                                <h5
                                                    style={{ borderBottom: "2px solid #cf2c6b", margin: "26px 0 25px 0", padding: '0 0 7px 0', fontWeight: "bold" }}>
                                                    Profile Authentication</h5>
                                                <div>
                                                    <p>There are few things you can do to help authenticate your profile and be included in certain
                        searc</p>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-6 col-form-label">Upload a Verification Photo to your profile</label>

                                                    <div className="col-sm-10 col-md-4">
                                                        <div className="upload-btn-wrapper">
                                                            <button className="btn">Upload Now</button>
                                                            <input
                                                                type="file"
                                                                name="myfile"
                                                                onChange={(event) => {
                                                                    if (event.currentTarget.files) {
                                                                        formik.setFieldValue("authenticationProfilePic", event.currentTarget.files[0]);
                                                                        const src = URL.createObjectURL(event.currentTarget.files[0]);
                                                                        formik.setFieldValue("authenticationProfilePicPreview", src);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-10 col-md-3">
                                                        {formik.values.authenticationProfilePicPreview && (
                                                            <img style={{ height: 100 }} src={formik.values.authenticationProfilePicPreview} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'row', width: isMobile ? "unset":"25%", marginLeft: isMobile ? "unset":'auto', justifyContent: "space-between" }}>
                                                    <div style={{ textAlign: "right" }}>
                                                        <input onClick={() => setRedirect(true)} type="submit" value="Go To Profile" className="form_btn" />
                                                    </div>

                                                    <div style={{ textAlign: "right" }}>
                                                        <input onClick={() => formik.handleSubmit()} type="submit" value="Save" className="form_btn" />
                                                    </div>
                                                </div>
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
export default ProfileEditPage;