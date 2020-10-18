import React, { useEffect } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import useAxios from 'axios-hooks'
import "../../css/timeline.css"
import { Link } from 'react-router-dom';
import { differenceInYears, parse } from 'date-fns'
import GetUserAge from '../../utils/GetUserAge';

function ListPostPage() {
    const [{ data, loading, error }, getUser] = useAxios({
        url: '/user/public/getUsers',
    }, { manual: true });

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <NavBar />
            <div className="container page-content">
                <div className="row">
                    <div className="col-md-3 col-xs-12">
                        <div className="row-xs">
                            <div className="main-box clearfix">
                                <h4>Advanced Search</h4>

                                <div className="profile-details">
                                    <div className="widget-body bordered-top bordered-sky">
                                        <div className="form-group">

                                            <h5 style={{ fontWeight: "normal" }}>Gender</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Male</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Female</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Couple</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Trans</span>
                                                </label>
                                            </div>



                                            <h5 style={{ fontWeight: "normal" }}>Region</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Channel Islands</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">London</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Northen Ireland</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">South West</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Yorkshire & the Humber</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">East Midlands</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">North East</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Scotland</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Wales</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">East of England (Anglia)</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">North West</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">South East</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">West Midlands</span>
                                                </label>
                                            </div>


                                            <label htmlFor="lginput">Location</label>
                                            <input type="text" className="form-control" id="lginput" placeholder="Location" style={{ borderRadius: "4px !important", margin: "0 0 5px 0 " }} />

                                            <h5 style={{ fontWeight: "normal" }}>Orientation</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Bi-curious</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Bi-sexual</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Gay</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Straight</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input type="checkbox" />
                                                    <span className="text">Orientation </span>
                                                </label>
                                            </div>



                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="col-md-7 ">

                        <div className="list_tab">

                            <ul>
                                <li><strong>Order BY :</strong></li>
                                <li><a href="#">Popularity / Views</a></li>
                                <li><a href="#">Age</a></li>
                                <li><a href="#">Proximity</a></li>
                            </ul>

                        </div>



                        <div className="col-inside-lg decor-default activities animated fadeInUp" id="activities">
                            <h3>Model List</h3>
                            {data && data.map((g: any) => {
                                return (
                                    <div key={g.nickname} className="unit">
                                        <Link className="avatar" to={`/profile/${g.id}`}>
                                            <img src={g.profilePic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="img-responsive" alt="profile" />
                                        </Link>
                                        <div className="field2 title">
                                            <Link to={`/profile/${g.id}`}>
                                                {g.nickname}
                                            </Link>
                                        </div>
                                        <div className="field date">
                                            <p>{g.orientation} {GetUserAge(g)} year old {g.gender}</p>
                                            {g.aboutYouSummary && <p>{g.aboutYouSummary}</p>}
                                            <Link style={{ width: "unset", fontSize: "unset" }} className="btn btn-azure" to={`/profile/${g.id}`}>
                                                View Post
                                            </Link>
                                            <Link style={{ width: "unset", fontSize: "unset" }} className="btn btn-azure" to={`/profile-video/${g.id}`}>
                                                View Video
                                            </Link>
                                            <Link style={{ width: "unset", fontSize: "unset" }} className="btn btn-azure" to={`/profile-pictures/${g.id}`}>
                                                View Picture
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                    <div className="col-md-2 ">
                        <div className="add_cont">
                            <div className="add_area"><img src="img/Photos/add1.jpg" alt="" className="profile-img img-responsive center-block show-in-modal" /></div>
                            <div className="add_area"><img src="img/Photos/add2.jpg" alt="" className="profile-img img-responsive center-block show-in-modal" /></div>
                            <div className="add_area"><img src="img/Photos/add3.jpg" alt="" className="profile-img img-responsive center-block show-in-modal" /></div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default ListPostPage;