import React, { useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import '../../css/Videos.css';
import '../../css/cover.css';
import '../../css/timeline.css';
import '../../css/Profile.css';
import useAxios from 'axios-hooks'
import ProfileHeader from './ProfileHeader';
import { useParams } from 'react-router-dom';

function VideosPage() {
    let { id } = useParams<{ id: string }>();
    const [currentIndex, setCurrentIndex] = useState(1);
    const itemsPerPage = 10
    const [user, setUser] = useState<any>({});

    const [getUserReq, getUser] = useAxios({
        url: `/user/public/getUser/${id}`,
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
                    <ProfileHeader user={user} />

                    <div className="row">
                        <div className="col-md-12">
                            <div id="grid" className="row" style={{ paddingTop: "20px" }}>
                                {getUserReq.loading ? <p>Loading...</p> : user?.Videos?.slice((currentIndex - 1), itemsPerPage * currentIndex).map((p: any) => {
                                    return (
                                        <div key={p.videoUrl.toString() + "-item"} className="mix col-sm-4 page1 page4 margin30">
                                            <div className="item-img-wrap ">
                                                <video style={{ height: 300 }} controls autoPlay src={p.videoUrl} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {!getUserReq.loading && user?.Videos?.length == 0 && <p>No Videos</p>}
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
                        <div className="col-sm-6 text-right">
                            <em>Displaying 1 to 8 (of 100 photos)</em>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default VideosPage;