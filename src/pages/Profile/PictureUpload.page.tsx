import React, { useState } from 'react';
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

function PictureUpload() {
    const alert = useAlert()
    const [showUploadModel, setShowUploadModel] = useState(false);

    const [{ data, loading, error }, sendFile] = useAxios({
        url: '/user/addPicture',
        method: 'POST',
    }, { manual: true });

    const [getPicturesReq, getPictures] = useAxios({
        url: '/user/getImages',
    });

    const [deletePicturesReq, deletePicture] = useAxios({
        url: '/user/deleteImage',
        method: 'DELETE'
    });

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
                    <ProfileHeader />
                    <div className="row">
                        <div className="col-md-12">
                            <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                {getPicturesReq.loading ? <p>Loading...</p> : getPicturesReq.data?.map((p: any) => {
                                    return (
                                        <div className="mix col-sm-4 page1 page4 margin30">
                                            <div className="item-img-wrap ">
                                                <img src={p.imageName} className="img-responsive" alt="workimg" />
                                                <div className="item-img-overlay">
                                                    <a href="#" onClick={(e) => {
                                                        e.preventDefault()
                                                        deletePicture({ data: { imageId: p.id }})
                                                        .then(() => {
                                                            alert.show('Image deleted!')
                                                            getPictures();
                                                        })
                                                    }} className="show-image">
                                                        <span className="item-img_text">
                                                            <i className="fa fa-times" aria-hidden="true"></i>
                                                            Delete
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="mix col-sm-4 page4  margin30">
                                    <div className="upload-btn-wrapper">
                                        <button onClick={() => setShowUploadModel(true)} className="btn">Upload A New Picture</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row gallery-bottom">
                        <div className="col-sm-6">
                            <ul className="pagination">
                                <li>
                                    <a href="#" aria-label="Previous">
                                        <span aria-hidden="true">«</span>
                                    </a>
                                </li>
                                <li className="active"><a href="#">1</a></li>
                                <li><a href="#">2</a></li>
                                <li><a href="#">3</a></li>
                                <li><a href="#">4</a></li>
                                <li><a href="#">5</a></li>
                                <li>
                                    <a href="#" aria-label="Next">
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
                                    getPictures();  
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