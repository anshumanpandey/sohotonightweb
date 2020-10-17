import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import ProfileHeader from './ProfileHeader';
import '../../css/profile2.css';
import '../../css/friends.css';
import '../../css/PictureUpload.css';
import { useAlert } from 'react-alert'
import AuthenticatedFactory from '../../utils/AuthenticatedFactory';
import SohoModal from '../../partials/SohoModal';
import { Formik, useFormik } from 'formik';
import useAxios from 'axios-hooks'
import ErrorLabel from '../../partials/ErrorLabel';
import { useParams } from 'react-router-dom';

function PictureUpload() {
    let { id } = useParams<{ id: string }>();
    const alert = useAlert()
    const [user, setUser] = useState<any>({});
    const [showUploadModel, setShowUploadModel] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(1);
    const itemsPerPage = 10

    const [{ data, loading, error }, sendFile] = useAxios({
        url: '/user/addPicture',
        method: 'POST',
    }, { manual: true });

    const [getUserReq, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
    }, { manual: true });

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data))
    }, [id])

    useEffect(() => {
        if (!getUserReq.loading && getUserReq.data) {
            setUser(getUserReq.data)
        }
    }, [getUserReq.loading])

    const [deletePicturesReq, deletePicture] = useAxios({
        url: '/user/deleteImage',
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
            data.append("picture", values.file)
            return sendFile({ data })
                .then(() => {
                    alert.show('Image Uploaded!')
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
                            <div style={{ position: 'absolute', right: 0, height: '100%' }}>
                                <div className="upload-btn-wrapper" style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                                    <button style={{ padding: 5, fontSize: 18, alignSelf: "center" }} onClick={() => setShowUploadModel(true)} className="btn">Upload A New Picture</button>
                                </div>
                            </div>
                        }
                    />
                    <div className="row">
                        <div className="col-md-12">
                            <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                {getUserReq.loading ? <p>Loading...</p> : getUserReq?.data?.Pictures?.slice((currentIndex - 1), itemsPerPage * currentIndex).map((p: any) => {
                                    return (
                                        <div className="mix col-sm-4 page1 page4 margin30">
                                            <div className="item-img-wrap">
                                                <a href="#" onClick={(e) => {
                                                    e.preventDefault()
                                                    deletePicture({ data: { imageId: p.id } })
                                                        .then(() => {
                                                            alert.show('Image deleted!')
                                                            getUser()
                                                        })
                                                }} className="show-image">
                                                    <span style={{ color: "white", fontSize: "18px", right: 0 }} className="item-img_text">
                                                        <i className="fa fa-times" aria-hidden="true"></i>
                                                            Delete
                                                        </span>
                                                </a>
                                                <img src={p.imageName} className="img-responsive" alt="workimg" />

                                            </div>
                                        </div>
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
                                    return <li className={currentIndex == (idx + 1) ? "active" : undefined}>
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
                        title="Upload picture"
                        footer={() => <button onClick={() => {
                            formik.submitForm()
                                .then(() => {
                                    setShowUploadModel(false)
                                    getUser();
                                    formik.resetForm()
                                })
                        }} type="button" className="btn btn-default">Save</button>}
                    >
                        <div role="form">
                            <div style={{ justifyContent: 'space-between', display: 'flex' }} className="upload-btn-wrapper">
                                <button style={{ alignSelf: "center", width: '30%' }} onClick={() => setShowUploadModel(true)} className="btn">
                                    Select
                                </button>
                                <input type="file" name="myfile" onChange={(event) => {
                                    if (event.currentTarget.files) {
                                        formik.setFieldValue("file", event.currentTarget.files[0]);
                                        const src = URL.createObjectURL(event.currentTarget.files[0]);
                                        formik.setFieldValue("filePreview", src);
                                    }
                                }} />
                                {formik.values.filePreview && <img style={{ height: 100 }} src={formik.values.filePreview} />}
                                {formik.errors.file && formik.touched.file && <ErrorLabel message={formik.errors.file} />}
                            </div>
                            <div className="form-group">
                                <label htmlFor="sminput">Price</label>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    placeholder="Price in £ "
                                    name="price"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                />
                                {formik.errors.price && formik.touched.price && <ErrorLabel message={formik.errors.price} />}
                            </div>
                        </div>
                    </SohoModal>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default PictureUpload;