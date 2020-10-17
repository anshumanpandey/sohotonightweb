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

function PicturesPage() {
    let { id } = useParams<{ id: string }>();
    const alert = useAlert()
    const [currentIndex, setCurrentIndex] = useState(1);
    const itemsPerPage = 10
    const [showUploadModel, setShowUploadModel] = useState< false | any>(false);
    const [user, setUser] = useState<any>({});

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
    return (
        <>
            <NavBar />
            <div className="row page-content">
                <div className="col-md-10 col-md-offset-1">
                    <ProfileHeader />
                    <div className="row">
                        <div className="col-md-12">
                            <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                {getUserReq.loading ? <p>Loading...</p> : getUserReq?.data?.Pictures?.slice((currentIndex - 1), itemsPerPage * currentIndex).map((p: any) => {
                                    return (
                                        <>
                                            {AuthenticatedFactory({
                                                authenticated: () => {
                                                    return <PictureUploadItem
                                                        onClick={() => setShowUploadModel(p)}
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
                                                    return <PictureItem onClick={() => setShowUploadModel(p)} src={p.imageName} />
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
                onClose={() => setShowUploadModel(false)}
                show={showUploadModel != false}
                title="View Image"
                footer={() => <button onClick={() => {
                    setShowUploadModel(false)
                }} type="button" className="btn btn-default">Close</button>}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img style={{ height: "450px"}} src={showUploadModel.imageName} />
                </div>
            </SohoModal>
            <Footer />
        </>
    );
}
export default PicturesPage;