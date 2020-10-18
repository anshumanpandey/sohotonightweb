import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import ProfileHeader from './ProfileHeader';
import '../../css/profile2.css';
import '../../css/friends.css';
import '../../css/PictureUpload.css';
import { useAlert } from 'react-alert'
import SohoModal from '../../partials/SohoModal';
import { Formik, useFormik } from 'formik';
import useAxios from 'axios-hooks'
import ErrorLabel from '../../partials/ErrorLabel';
import { useParams } from 'react-router-dom';
import { startGlobalLoading, stopGlobalLoading } from '../../state/GlobalState';
import { Line } from 'rc-progress';
import SohoButton from '../../partials/SohoButton';
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';
import IsOwnProfile from '../../utils/IsOwnProfile';

function VideoUpload() {
    let { id } = useParams<{ id: string }>();
    const alert = useAlert()
    const [user, setUser] = useState<any>({});
    const [percentageCompleted, setPercentageCompleted] = useState(0);
    const [showUploadModel, setShowUploadModel] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const itemsPerPage = 10

    const [{ data, loading, error }, sendFile] = useAxios({
        url: '/user/addVideo',
        method: 'POST',
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setPercentageCompleted(percentCompleted)
        }
    }, { manual: true });

    const [getUserReq, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    const [deletePicturesReq, deletePicture] = useAxios({
        url: '/user/deleteVideo',
        method: 'DELETE'
    }, { manual: true });

    const formik = useFormik({
        initialValues: {
            price: '',
            file: null,
            filePreview: ''
        },
        onSubmit: values => {
            const data = new FormData()
            //@ts-ignore
            data.append("price", values.price)
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
        },
        validate: values => {
            const errors: any = {};
            if (!values.price) {
                errors.price = 'Required';
            }
            if (!values.file) {
                errors.file = 'Required';
            }
            return errors;
        }
    });

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
                            <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                {!getUserReq.loading && getUserReq?.data?.Videos.length == 0 && <p style={{ fontSize: 22, textAlign: 'center', color: "#d32a6b" }}>No Videos</p>}
                                {getUserReq.loading ? <p style={{ fontSize: 22, textAlign: 'center', color: "#d32a6b" }}>Loading...</p> : getUserReq.data?.Videos?.slice((currentIndex - 1), itemsPerPage * currentIndex).map((p: any) => {
                                    return (
                                        <>
                                            {AuthenticatedFactory({
                                                user,
                                                authenticated: () => {
                                                    return (
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
                                                    );
                                                },
                                                nonAuthenticated: () => {
                                                    return (
                                                        <div key={p.videoUrl.toString() + "-item"} className="mix col-sm-4 page1 page4 margin30">
                                                            <div style={{ backgroundColor: 'black' }} className="item-img-wrap ">
                                                                <a href="#" className="show-image">
                                                                    <span style={{ color: "white", fontSize: "18px", right: 0, bottom: 0, backgroundColor: '#d32a6b80', padding: '0.5rem', borderRadius: "0.25rem" }} className="item-img_text">
                                                                        <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                                                    Buy Now <br /> £{p.price}
                                                                    </span>
                                                                </a>
                                                                <video style={{ height: 300 }} controls src={p.videoUrl} />
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </>
                                    );
                                })}
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
                                {Array(Math.floor((getUserReq?.data?.length || 1) / 10) + 1).fill(1).map((_, idx) => {
                                    return <li key={idx.toString() + "-item"} className={currentIndex == (idx + 1) ? "active" : undefined}>
                                        <a onClick={() => setCurrentIndex(idx + 1)} href="#">{idx + 1}</a>
                                    </li>
                                })}
                                <li>
                                    <a onClick={() => setCurrentIndex(Math.floor((getUserReq?.data?.length || 1) / 10) + 1)} href="#" aria-label="Next">
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
                            <div className="form-group">
                                <label style={{ display: 'table', marginLeft: 'auto', marginRight: 'auto' }} htmlFor="sminput">Price</label>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    placeholder="Price in £ "
                                    name="price"
                                    style={{ width: '35%', marginLeft: 'auto', marginRight: 'auto' }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                />
                                {formik.errors.price && formik.touched.price && <ErrorLabel message={formik.errors.price} />}
                            </div>
                            {loading && (
                                <div>
                                    <p style={{ textAlign: 'center' }}>Completed {percentageCompleted}%</p>
                                    <Line percent={percentageCompleted} strokeWidth={4} strokeColor="#d32a6b" />
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