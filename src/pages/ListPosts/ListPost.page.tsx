import React, { useCallback, useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import useAxios from 'axios-hooks'
import "../../css/timeline.css"
import { Link } from 'react-router-dom';
import GetUserAge from '../../utils/GetUserAge';
import UkCounties from '../../utils/UkCounties.json'

enum FILTER_KEY {
    GENDER = "GENDER",
    ORIENTATION = "ORIENTATION",
    COUNTY = "COUNTY",
    LOCATION = "LOCATION",
}

function ListPostPage() {
    const [searchFilter, setSearchFilter] = useState<any>({ [FILTER_KEY.LOCATION]: "", [FILTER_KEY.GENDER]: [], [FILTER_KEY.ORIENTATION]: [], [FILTER_KEY.COUNTY]: [] })
    const toggleFilterFor = useCallback((k: FILTER_KEY, val: string) => {
        setSearchFilter((p: any) => {
            const filterOf = p[k]
            const found = filterOf.find((r: string) => r == val)
            return { ...p, [k]: found ? p[k].filter((i: string) => i != found) : p[k].concat([val]) }
        })
    }, [])
    const setLocationFilter = useCallback((val: string) => {
        setSearchFilter((p: any) => {
            return { ...p, [FILTER_KEY.LOCATION]: val }
        })
    }, [])

    const [filteredUsers, setFilteredUsers] = useState<any>([])

    const [{ data, loading, error }, getUser] = useAxios({
        url: '/user/public/getUsers',
    }, { manual: true });

    useEffect(() => {
        getUser()
            .then(({ data }) => setFilteredUsers(data))
    }, [])

    useEffect(() => {
        if (!data) return
        const r = data
            .filter((a: any) => {
                return searchFilter[FILTER_KEY.GENDER].length != 0 ? searchFilter[FILTER_KEY.GENDER].includes(a.gender) : true
            })
            .filter((a: any) => {
                return searchFilter[FILTER_KEY.ORIENTATION].length != 0 ? searchFilter[FILTER_KEY.ORIENTATION].includes(a.orientation) : true
            })
            .filter((a: any) => {
                return searchFilter[FILTER_KEY.COUNTY].length != 0 ? searchFilter[FILTER_KEY.COUNTY].includes(a.county) : true
            })
            .filter((a: any) => {
                return searchFilter[FILTER_KEY.LOCATION] ? searchFilter[FILTER_KEY.LOCATION].includes(a.town) : true
            })
        setFilteredUsers([...r])
    }, [searchFilter[FILTER_KEY.GENDER], searchFilter[FILTER_KEY.ORIENTATION], searchFilter[FILTER_KEY.COUNTY], searchFilter[FILTER_KEY.LOCATION]])

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

                                            <label htmlFor="lginput">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Location"
                                                style={{ borderRadius: "4px !important", margin: "0 0 5px 0 " }}
                                                onChange={(e) => setLocationFilter(e.currentTarget.value)}
                                            />

                                            <h5 style={{ fontWeight: "normal" }}>Gender</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={() => { toggleFilterFor(FILTER_KEY.GENDER, "Male") }} type="checkbox" />
                                                    <span className="text">Male</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { toggleFilterFor(FILTER_KEY.GENDER, "Female") }} type="checkbox" />
                                                    <span className="text">Female</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { toggleFilterFor(FILTER_KEY.GENDER, "Couple") }} type="checkbox" />
                                                    <span className="text">Couple</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { toggleFilterFor(FILTER_KEY.GENDER, "Trans") }} type="checkbox" />
                                                    <span className="text">Trans</span>
                                                </label>
                                            </div>

                                            <h5 style={{ fontWeight: "normal" }}>Region</h5>

                                            {UkCounties.sort((a, b) => a.County.localeCompare(b.County)).map(c => {
                                                return <div className="checkbox">
                                                    <label>
                                                        <input onClick={() => { toggleFilterFor(FILTER_KEY.COUNTY, c.County) }} type="checkbox" />
                                                        <span className="text">{c.County}</span>
                                                    </label>
                                                </div>
                                            })}

                                            <h5 style={{ fontWeight: "normal" }}>Orientation</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { toggleFilterFor(FILTER_KEY.ORIENTATION, "Bi-curious") }} type="checkbox" />
                                                    <span className="text">Bi-curious</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { toggleFilterFor(FILTER_KEY.ORIENTATION, "Bi-sexual") }} type="checkbox" />
                                                    <span className="text">Bi-sexual</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { toggleFilterFor(FILTER_KEY.ORIENTATION, "Gay") }} type="checkbox" />
                                                    <span className="text">Gay</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { toggleFilterFor(FILTER_KEY.ORIENTATION, "Straight") }} type="checkbox" />
                                                    <span className="text">Straight</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className="col-md-7 ">
                        <div className="col-inside-lg decor-default activities animated fadeInUp" id="activities">
                            <h3>Model List</h3>
                            {loading && <p style={{ fontSize: 20, textAlign: 'center', color: "#d32a6b" }}>Loading...</p>}
                            {!loading && filteredUsers.length == 0 && <p style={{ fontSize: 20, textAlign: 'center', color: "#d32a6b" }}>No user found</p>}

                            {filteredUsers.map((g: any) => {
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