import React, { useEffect, useState } from 'react';
import Footer from '../../../partials/Footer';
import NavBar from '../../../partials/NavBar';
import '../../../css/Pictures.css';
import '../../../css/cover.css';
import '../../../css/timeline.css';
import '../../../css/Profile.css';
import '../../../css/photos1.css';
import '../../../css/photos2.css';
import ProfileHeader from '../ProfileHeader';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import useAxios from 'axios-hooks'
import AuthenticatedFactory from '../../../utils/AuthenticatedFactory';
import { PictureUploadItem } from './PictureUploadItem';
import { PictureItem } from './PictureItem';
import { useAlert } from 'react-alert';
import SohoModal from '../../../partials/SohoModal';
import { useFormik } from 'formik';
import ErrorLabel from '../../../partials/ErrorLabel';
import SohoButton from '../../../partials/SohoButton';
import IsOwnProfile from '../../../utils/IsOwnProfile';
import { showConfirmBuyingAsset } from '../../../state/GlobalState';
import UserIsLogged from '../../../utils/UserIsLogged';

function PicturesPage() {
    let { id } = useParams<{ id: string }>();
    let history = useHistory();

    const alert = useAlert()
    const [currentIndex, setCurrentIndex] = useState(1);
    const itemsPerPage = 10
    const [goToPayment, setGoToPayment] = useState<any>(false);
    const [showPreviewModal, setShowPreviewModal] = useState<false | any>(false);
    const [showUploadModel, setShowUploadModel] = useState<false | any>(false);
    const [user, setUser] = useState<any>({});
    const [currentTab, setCurrentTab] = useState(0)

    const [{ data, loading, error }, sendFile] = useAxios({
        url: '/user/addPicture',
        method: 'POST',
    }, { manual: true });

    const [getUserReq, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    const [deletePicturesReq, deletePicture] = useAxios({
        url: '/user/deleteImage',
        method: 'DELETE'
    }, { manual: true });

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    const getPictures = () => {
        return getUserReq?.data?.Pictures?.filter((c: any) => {
            if (currentTab == 0) {
                return c.isFree
            }
            return !c.isFree
        }) || []
    }

    const formik = useFormik({
        initialValues: {
            price: '',
            file: null,
            filePreview: '',
            isFree: 0,
        },
        onSubmit: values => {
            const data = new FormData()
            //@ts-ignore
            data.append("price", values.price)
            data.append("isFree", values.isFree.toString())
            //@ts-ignore
            data.append("picture", values.file)
            return sendFile({ data })
                .then(() => {
                    alert.show('Image Uploaded!')
                    setShowUploadModel(false)
                    getUser();
                    formik.resetForm()
                })
        },
        validate: values => {
            const errors: any = {};
            if (values.isFree == 0 && !values.price) {
                errors.price = 'Required';
            }
            if (!values.file) {
                errors.file = 'Required';
            }
            return errors;
        }
    });

    if (goToPayment && goToPayment.id) return <Redirect to={`/payment/picture/${goToPayment.id}`} />

    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader
                        user={user}
                        extraContent={
                            <>
                                {IsOwnProfile({ user }) && <div style={{ display: 'flex', position: 'absolute', right: 0, height: '100%' }}>
                                    <SohoButton style={{ display: 'flex', justifySelf: 'center' }} onClick={() => setShowUploadModel(true)} value="+ Add Picture" />
                                </div>}
                            </>
                        }
                    />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tabs-wrapper profile-tabs">
                                <ul className="nav nav-tabs">
                                    <li className={currentTab == 0 ? "active" : undefined}>
                                        <a onClick={() => setCurrentTab(0)} href="#general" data-toggle="tab">Free</a>
                                    </li>
                                    <li className={currentTab == 1 ? "active" : undefined}>
                                        <a onClick={() => setCurrentTab(1)} href="#personal-details" data-toggle="tab">Paid</a>
                                    </li>
                                </ul>
                                <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                    {!getUserReq.loading && getPictures().length == 0 && <p style={{ fontSize: 22, textAlign: 'center', color: "#d32a6b" }}>No Images</p>}
                                    {getUserReq.loading ? <p>Loading...</p> : getPictures()?.slice((currentIndex - 1), itemsPerPage * currentIndex).map((p: any) => {
                                        return (
                                            <>
                                                {IsOwnProfile({ user}) && (
                                                    <PictureUploadItem
                                                        key={p.id.toString() + "-item"}
                                                        onClick={() => setShowPreviewModal(p)}
                                                        src={p.assetUrl}
                                                        onDeleteClick={() => {
                                                            deletePicture({ data: { imageId: p.id } })
                                                                .then(() => {
                                                                    alert.show('Image deleted!')
                                                                    getUser()
                                                                })
                                                        }}
                                                    />
                                                )}
                                                {UserIsLogged() && !IsOwnProfile({ user }) && (
                                                    <div key={p.id.toString() + "-item"} className="mix col-sm-4 page1 page4 margin30">
                                                        <PictureItem
                                                            isFree={p.isFree}
                                                            image={p.isFree ? p : { ...p, assetUrl: require("../../../img/soho-watchme.png")}}
                                                            onClick={() => {
                                                                showConfirmBuyingAsset({ ...p, type: 'PICTURE' })
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                {!UserIsLogged() && !IsOwnProfile({ user }) && (
                                                    <div key={p.id.toString() + "-item"} className="mix col-sm-4 page1 page4 margin30">
                                                        <PictureItem
                                                            isFree={p.isFree}
                                                            innerText="Click to login and buy"
                                                            image={p.isFree ? p : { ...p, assetUrl: require("../../../img/soho-watchme.png")}}
                                                            onClick={() => {
                                                                history.push("/register")
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row gallery-bottom">
                        <div className="col-sm-6">
                            <ul className="pagination">
                                <li>
                                    <a onClick={() => setCurrentIndex(1)} href="#" aria-label="Previous">
                                        <span aria-hidden="true">«</span>
                                    </a>
                                </li>
                                {Array(Math.floor((getPictures().length || 1) / 10) + 1).fill(1).map((_, idx) => {
                                    return <li key={`${idx}-item`} className={currentIndex == (idx + 1) ? "active" : undefined}>
                                        <a onClick={() => setCurrentIndex(idx + 1)} href="#">{idx + 1}</a>
                                    </li>
                                })}
                                <li>
                                    <a onClick={() => setCurrentIndex(Math.floor((getPictures().length || 1) / 10) + 1)} href="#" aria-label="Next">
                                        <span aria-hidden="true">»</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
            <SohoModal
                size="lg"
                onClose={() => setShowPreviewModal(false)}
                show={showPreviewModal != false}
                title="View Image"
                footer={() => {
                    return (
                        <>
                            {AuthenticatedFactory({
                                user: user,
                                authenticated: () => {
                                    return (
                                        <button onClick={() => {
                                            setShowPreviewModal(false)
                                        }} type="button" className="btn btn-default">Close</button>
                                    );
                                },
                                nonAuthenticated: () => {
                                    return (
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    const cloned = { ...showPreviewModal }
                                                    setShowPreviewModal(false)
                                                    setTimeout(() => {
                                                        setGoToPayment(cloned)
                                                    }, 0)
                                                }}
                                                href="#"
                                                style={{ color: "#cf2c6b" }}
                                            >
                                                <i className="fa fa-shopping-cart" aria-hidden="true"></i> &nbsp; Buy Now
                                        </a>
                                        </div>
                                    )
                                }
                            })}
                        </>
                    );
                }}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img style={{ maxHeight: "350px" }} src={showPreviewModal.assetUrl} />
                </div>
            </SohoModal>

            <SohoModal
                size={"lg"}
                onClose={() => setShowUploadModel(false)}
                show={showUploadModel}
                title="Upload picture"
                footer={() => <button onClick={() => formik.submitForm()} type="button" className="btn btn-default">Save</button>}
            >
                <div role="form">
                    <div style={{ justifyContent: 'space-between', display: 'flex' }} className="upload-btn-wrapper">
                        <SohoButton style={{ width: '35%', marginLeft: 'auto', marginRight: 'auto' }} onClick={() => setShowUploadModel(true)} value="Select" />
                        <input accept="image/*" type="file" name="myfile" onChange={(event) => {
                            if (event.currentTarget.files) {
                                formik.setFieldValue("file", event.currentTarget.files[0]);
                                const src = URL.createObjectURL(event.currentTarget.files[0]);
                                formik.setFieldValue("filePreview", src);
                            }
                        }} />
                        {formik.errors.file && formik.touched.file && <ErrorLabel message={formik.errors.file} />}
                    </div>
                    {formik.values.filePreview && <img style={{ maxHeight: "350px", marginLeft: "auto", marginRight: "auto", display: "table" }} src={formik.values.filePreview} />}
                    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '80px' }}>
                        <div style={{ width: '15%', alignItems: "flex-end", display: "flex" }} className="form-group">
                            <div className="checkbox">
                                <label>
                                    <input
                                        checked={formik.values.isFree == 1}
                                        value={formik.values.isFree}
                                        onChange={(e) => {
                                            formik.setFieldValue("isFree", e.currentTarget.value == "1" ? 0 : 1)
                                        }}
                                        onBlur={formik.handleBlur}
                                        type="checkbox"
                                    />
                                    <span className="text">Is Free</span>
                                </label>
                            </div>
                            {formik.errors.price && formik.touched.price && <ErrorLabel message={formik.errors.price} />}
                        </div>
                        {formik.values.isFree == 0 && (
                            <div style={{ width: '85%' }} className="form-group">
                                <label style={{ display: 'table', marginLeft: '10%', marginRight: 'auto' }} htmlFor="sminput">Price</label>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    placeholder="Price in £ "
                                    name="price"
                                    style={{ width: '35%', marginLeft: '10%', marginRight: 'auto' }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                />
                                {formik.errors.price && formik.touched.price && <ErrorLabel message={formik.errors.price} />}
                            </div>
                        )}
                    </div>
                </div>
            </SohoModal>
            <Footer />
        </>
    );
}
export default PicturesPage;