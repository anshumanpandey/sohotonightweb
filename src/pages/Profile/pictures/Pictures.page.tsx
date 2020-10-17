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
import { useParams } from 'react-router-dom';
import useAxios from 'axios-hooks'
import AuthenticatedFactory from '../../../utils/AuthenticatedFactory';
import { PictureUploadItem } from './PictureUploadItem';
import { PictureItem } from './PictureItem';
import { useAlert } from 'react-alert';
import SohoModal from '../../../partials/SohoModal';
import { useFormik } from 'formik';
import ErrorLabel from '../../../partials/ErrorLabel';
import SohoButton from '../../../partials/SohoButton';

function PicturesPage() {
    let { id } = useParams<{ id: string }>();
    const alert = useAlert()
    const [currentIndex, setCurrentIndex] = useState(1);
    const itemsPerPage = 10
    const [showPreviewModal, setShowPreviewModal] = useState<false | any>(false);
    const [showUploadModel, setShowUploadModel] = useState<false | any>(false);
    const [user, setUser] = useState<any>({});

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
                    setShowUploadModel(false)
                    getUser();
                    formik.resetForm()
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
                                {AuthenticatedFactory({
                                    authenticated: () => {
                                        return <div style={{ display: 'flex',position: 'absolute', right: 0, height: '100%' }}>
                                            <SohoButton style={{ display: 'flex', justifySelf: 'center'}} onClick={() => setShowUploadModel(true)} value="+ Add Picture" />
                                        </div>
                                    }
                                })}
                            </>
                        }
                    />
                    <div className="row">
                        <div className="col-md-12">
                            <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                {!getUserReq.loading && getUserReq?.data?.Pictures.length == 0 && <p style={{ fontSize: 22, textAlign: 'center', color: "#d32a6b"}}>No Images</p>}
                                {getUserReq.loading ? <p>Loading...</p> : getUserReq?.data?.Pictures?.slice((currentIndex - 1), itemsPerPage * currentIndex).map((p: any) => {
                                    return (
                                        <>
                                            {AuthenticatedFactory({
                                                authenticated: () => {
                                                    return <PictureUploadItem
                                                        key={p.id.toString() + "-item"}
                                                        onClick={() => setShowPreviewModal(p)}
                                                        src={p.imageName}
                                                        onDeleteClick={() => {
                                                            deletePicture({ data: { imageId: p.id } })
                                                                .then(() => {
                                                                    alert.show('Image deleted!')
                                                                    getUser()
                                                                })
                                                        }}
                                                    />
                                                },
                                                nonAuthenticated: () => {
                                                    return <PictureItem key={p.id.toString() + "-item"} onClick={() => setShowPreviewModal(p)} src={p.imageName} />
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
                </div>
            </div>
            <SohoModal
                size="lg"
                onClose={() => setShowPreviewModal(false)}
                show={showPreviewModal != false}
                title="View Image"
                footer={() => <button onClick={() => {
                    setShowPreviewModal(false)
                }} type="button" className="btn btn-default">Close</button>}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img style={{ maxHeight: "350px" }} src={showPreviewModal.imageName} />
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
                        <SohoButton onClick={() => setShowUploadModel(true)} value="Select" />
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
            <Footer />
        </>
    );
}
export default PicturesPage;