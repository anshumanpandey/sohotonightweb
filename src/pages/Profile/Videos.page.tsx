import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import ProfileHeader from './ProfileHeader';
import '../../css/profile2.css';
import '../../css/friends.css';
import '../../css/PictureUpload.css';
import { useAlert } from 'react-alert'
import Loader from "react-loader-spinner";
import SohoModal from '../../partials/SohoModal';
import { useFormik } from 'formik';
import useAxios from 'axios-hooks'
import ErrorLabel from '../../partials/ErrorLabel';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import SohoButton from '../../partials/SohoButton';
import IsOwnProfile from '../../utils/IsOwnProfile';
import { BrandColor } from '../../utils/Colors';
import { showConfirmBuyingAsset, useGlobalState } from '../../state/GlobalState';
import UserIsLogged from '../../utils/UserIsLogged';
import UserBoughtAsset from '../../utils/UserBoughtAsset';
import DownloadFileByUrl from '../../utils/DownloadFileByUrl';

function VideoUpload() {
    let { id } = useParams<{ id: string }>();
    const alert = useAlert()
    let history = useHistory();
    
    const [userData] = useGlobalState("userData");
    const [user, setUser] = useState<any>({});
    const [currentTab, setCurrentTab] = useState(0)
    const [goToPayment, setGoToPayment] = useState<boolean>(false);
    const [buyingVideo, setBuyingVideo] = useState<false | any>(false);
    const [percentageCompleted, setPercentageCompleted] = useState(0);
    const [showUploadModel, setShowUploadModel] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const itemsPerPage = 10

    const [{ data, loading, error }, sendFile] = useAxios({
        url: '/user/addVideo',
        method: 'POST',
    }, { manual: true });

    const [getUserReq, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    const [generateUrlReq, generateUrl] = useAxios({
        url: `/assets/generateUrl`,
        method: 'POST'
    }, { manual: true });

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    const [deletePicturesReq, deletePicture] = useAxios({
        url: '/user/deleteVideo',
        method: 'DELETE'
    }, { manual: true });

    const getVideos = () => {
        return getUserReq?.data?.Videos?.filter((c: any) => {
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
            data.append("video", values.file)
            return sendFile({ data })
                .then(() => {
                    alert.show('Video Uploaded!')
                    setShowUploadModel(false)
                    getUser();
                    formik.resetForm()
                    setPercentageCompleted(0)
                })
                .catch(() => {
                    setPercentageCompleted(0)
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

    if (goToPayment && buyingVideo.id) return <Redirect to={`/payment/video/${buyingVideo.id}`} />

    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader
                        user={user}
                        extraContent={
                            <>
                                {IsOwnProfile({ user }) && (
                                    <div style={{ display: 'flex', position: 'absolute', right: 0, height: '100%' }}>
                                        <SohoButton style={{ display: 'flex', justifySelf: 'center' }} onClick={() => setShowUploadModel(true)} value="+ Add Video" />
                                    </div>
                                )}
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
                                    {!getUserReq.loading && getVideos().length == 0 && <p style={{ fontSize: 22, textAlign: 'center', color: "#d32a6b" }}>No Videos</p>}
                                    {getUserReq.loading ? <p style={{ fontSize: 22, textAlign: 'center', color: "#d32a6b" }}>Loading...</p> : getVideos().slice((currentIndex - 1), itemsPerPage * currentIndex).map((p: any) => {
                                        return (
                                            <>
                                                {IsOwnProfile({ user }) && (
                                                    <div key={p.id.toString() + "-item"} className="mix col-sm-4 page1 page4 margin30">
                                                        <div style={{ backgroundColor: 'black' }} className="item-img-wrap ">
                                                            <a href="#" onClick={(e) => {
                                                                e.preventDefault()
                                                                deletePicture()
                                                            }} className="show-image">
                                                                <span style={{ color: "white", fontSize: "18px", right: 0, backgroundColor: '#d32a6b80', padding: '0.5rem', borderRadius: "0.25rem" }} className="item-img_text">
                                                                    <i className="fa fa-times" aria-hidden="true"></i>
                                                            Delete
                                                        </span>
                                                            </a>
                                                            <video style={{ height: 250 }} controls src={p.videoUrl} />
                                                        </div>
                                                    </div>
                                                )}
                                                {UserIsLogged() && !IsOwnProfile({ user }) && (
                                                    <div key={p.id.toString() + "-item"} className="mix col-sm-4 page1 page4 margin30">
                                                        {p.isFree ? (
                                                            <div style={{ backgroundColor: 'black' }} className="item-img-wrap ">
                                                                <video style={{ height: 300 }} controls src={p.videoUrl} />
                                                            </div>
                                                        ) : (
                                                            <div style={{ backgroundColor: 'black' }} className="item-img-wrap ">
                                                                <a
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        if (UserBoughtAsset({ user: userData, asset: p, type: "VIDEO" })) {
                                                                            generateUrl({ data: { assetId: p.id, assetType: "VIDEO"} })
                                                                            .then(({ data }) => {
                                                                                DownloadFileByUrl(data.url)
                                                                            })
                                                                        } else {
                                                                            showConfirmBuyingAsset({ ...p, type: 'VIDEO' })
                                                                        }
                                                                    }}
                                                                    href="#"
                                                                    className="show-image"
                                                                >
                                                                    <span style={{ color: "white", fontSize: "18px", right: 0, bottom: 0, backgroundColor: '#d32a6b80', padding: '0.5rem', borderRadius: "0.25rem" }} className="item-img_text">
                                                                        {!UserBoughtAsset({ user: userData, asset: p, type: "VIDEO" }) ? (<><i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                                                    Buy Now <br /> {p.price}</>): "Download"}
                                                                    </span>
                                                                </a>
                                                                <img src={require("../../img/soho-watchme.png")} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {!UserIsLogged() && (
                                                    <div key={p.id.toString() + "-item"} className="mix col-sm-4 page1 page4 margin30">
                                                        {p.isFree ? (
                                                            <div style={{ backgroundColor: 'black' }} className="item-img-wrap ">
                                                                <video style={{ height: 300 }} controls src={p.videoUrl} />
                                                            </div>
                                                        ) : (
                                                            <div style={{ backgroundColor: 'black' }} className="item-img-wrap ">
                                                                <a
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        history.push("/login")
                                                                    }}
                                                                    href="#"
                                                                    className="show-image"
                                                                >
                                                                    <span style={{ color: "white", fontSize: "18px", right: 0, bottom: 0, backgroundColor: '#d32a6b80', padding: '0.5rem', borderRadius: "0.25rem" }} className="item-img_text">
                                                                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                                                    Login to buy
                                                                    </span>
                                                                </a>
                                                                <img src={require("../../img/soho-watchme.png")} />
                                                            </div>
                                                        )}
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
                                {Array(Math.floor((getVideos().length || 1) / 10) + 1).fill(1).map((_, idx) => {
                                    return <li key={idx.toString() + "-item"} className={currentIndex == (idx + 1) ? "active" : undefined}>
                                        <a onClick={() => setCurrentIndex(idx + 1)} href="#">{idx + 1}</a>
                                    </li>
                                })}
                                <li>
                                    <a onClick={() => setCurrentIndex(Math.floor((getVideos().length || 1) / 10) + 1)} href="#" aria-label="Next">
                                        <span aria-hidden="true">»</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                    <SohoModal
                        onClose={() => setShowUploadModel(false)}
                        show={showUploadModel}
                        title="Upload Video"
                        footer={() => <button onClick={() => formik.submitForm()} type="button" className="btn btn-default">Save</button>}
                    >
                        <div role="form">
                            <div style={{ justifyContent: 'space-between', display: 'flex' }} className="upload-btn-wrapper">
                                <SohoButton style={{ width: '35%', marginLeft: 'auto', marginRight: 'auto' }} onClick={() => setShowUploadModel(true)} value="Select" />
                                <input accept="video/*" type="file" name="myfile" onChange={(event) => {
                                    if (event.currentTarget.files) {
                                        formik.setFieldValue("file", event.currentTarget.files[0]);
                                        const src = URL.createObjectURL(event.currentTarget.files[0]);
                                        formik.setFieldValue("filePreview", src);
                                    }
                                }} />
                                {formik.errors.file && formik.touched.file && <ErrorLabel message={formik.errors.file} />}
                            </div>
                            {formik.values.filePreview && <video controls style={{ marginLeft: "auto", marginRight: "auto", display: "table", height: 200 }} src={formik.values.filePreview} />}
                            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '80px' }}>
                                <div style={{ width: '15%', alignItems: "flex-end", display: "flex" }} className="form-group">
                                    <div className="checkbox">
                                        <label style={{ paddingLeft: 0 }}>
                                            <input
                                                checked={formik.values.isFree == 1}
                                                value={formik.values.isFree}
                                                onChange={(e) => {
                                                    console.log(e.currentTarget.value)
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
                                        <label style={{ display: 'table', marginRight: 'auto' }} htmlFor="sminput">Price</label>
                                        <input
                                            type="text"
                                            className="form-control input-sm"
                                            placeholder="Price in £ "
                                            name="price"
                                            style={{ width: '35%', marginRight: 'auto' }}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.price}
                                        />
                                        {formik.errors.price && formik.touched.price && <ErrorLabel message={formik.errors.price} />}
                                    </div>
                                )}
                            </div>
                            {loading && (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Loader
                                        type="ThreeDots"
                                        color={BrandColor}
                                        height={80}
                                        width={80}
                                    />
                                </div>
                            )}
                        </div>
                    </SohoModal>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default VideoUpload;