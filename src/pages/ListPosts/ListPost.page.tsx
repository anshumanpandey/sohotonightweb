import React, { useCallback, useEffect, useState } from 'react';
import Footer from '../../partials/Footer';
import NavBar from '../../partials/NavBar';
import useAxios from 'axios-hooks'
import "../../css/timeline.css"
import { Link } from 'react-router-dom';
import GetUserAge from '../../utils/GetUserAge';
import UkLocations from '../../utils/Location.json'
import UkLocationsDropdown from '../../partials/UkLocationsDropdown';

enum FILTER_KEY {
    GENDER = "GENDER",
    ORIENTATION = "ORIENTATION",
    COUNTY = "COUNTY",
    LOCATION = "LOCATION",
}

const getCountiesFromUsers = (users: any = []) => {
    const counties = users.map((u: any) => u.county).filter((c: any) => c)
    return Array.from(new Set(counties).values())
}

type FilterObject = { forSearchKey: FILTER_KEY, val: any }

const useFilters = () => {
    const [filters, setFilters] = useState<FilterObject[]>([]);

    const addValueFor = (forKey: FILTER_KEY, val: any) => {
        const filtersOfThisKey = filters.filter(f => f.forSearchKey == forKey)
        const found = filtersOfThisKey.find(f => f.val == val)


        setFilters(prev => {
            let newState = prev
            if (found) {
                newState = prev.filter(f => f.forSearchKey != found.forSearchKey && f.val != found.val)
            } else {
                newState.push({ forSearchKey: forKey, val })
            }

            return [...newState]
        })
    }

    const setValueFor = (forKey: FILTER_KEY, val: any) => {
        setFilters(prev => {
            return prev
                .filter(f => f.forSearchKey != forKey)
                .concat([{ forSearchKey: forKey, val }])
        })
    }

    const clearFilterFor = (forKey: FILTER_KEY) => {
        setFilters(prev => {
            return prev
                .filter(f => f.forSearchKey != forKey)
        })
    }

    const getValuesFiltersFor = (forKey: FILTER_KEY) => {
        return filters.filter(f => f.forSearchKey == forKey).map(f => f.val)
    }

    return {
        filters,
        clearFilterFor,
        setValueFor,
        addValueFor,
        getValuesFiltersFor
    }
}

function ListPostPage() {
    const { filters, addValueFor, setValueFor, clearFilterFor, getValuesFiltersFor } = useFilters()

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
                const filters = getValuesFiltersFor(FILTER_KEY.GENDER)
                return filters.length != 0 ? filters.includes(a.gender) : true
            })
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.ORIENTATION)
                return filters.length != 0 ? filters.includes(a.orientation) : true
            })
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.COUNTY)
                return filters.length != 0 ? filters.includes(a.county) : true
            })
            .filter((a: any) => {
                const filters = getValuesFiltersFor(FILTER_KEY.LOCATION)
                return filters.length != 0 ? filters.some(f => a.town?.startsWith(f)) : true
            })
        setFilteredUsers([...r])
    }, [filters])

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
                                            <UkLocationsDropdown
                                                onChange={(e) => {
                                                    if (e.currentTarget.value !== "0") {
                                                        setValueFor(FILTER_KEY.LOCATION, e.currentTarget.value)
                                                    } else {
                                                        clearFilterFor(FILTER_KEY.LOCATION)
                                                    }
                                                }}
                                            />

                                            <h5 style={{ fontWeight: "normal" }}>Gender</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input onChange={() => { addValueFor(FILTER_KEY.GENDER, "Male") }} type="checkbox" />
                                                    <span className="text">Male</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.GENDER, "Female") }} type="checkbox" />
                                                    <span className="text">Female</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.GENDER, "Couple") }} type="checkbox" />
                                                    <span className="text">Couple</span>
                                                </label>
                                            </div>
                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.GENDER, "Trans") }} type="checkbox" />
                                                    <span className="text">Trans</span>
                                                </label>
                                            </div>

                                            <h5 style={{ fontWeight: "normal" }}>Orientation</h5>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Bi-curious") }} type="checkbox" />
                                                    <span className="text">Bi-curious</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Bi-sexual") }} type="checkbox" />
                                                    <span className="text">Bi-sexual</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Gay") }} type="checkbox" />
                                                    <span className="text">Gay</span>
                                                </label>
                                            </div>

                                            <div className="checkbox">
                                                <label>
                                                    <input onClick={() => { addValueFor(FILTER_KEY.ORIENTATION, "Straight") }} type="checkbox" />
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between'}} className="field2 title">
                                            <Link to={`/profile/${g.id}`}>
                                                {g.nickname}
                                            </Link>
                                            Contact Me: {g.callNumber}
                                        </div>
                                        <div className="field date">
                                            <p>{g.orientation} {GetUserAge(g)} year old {g.gender}</p>
                                            {g.aboutYouSummary && <p>{g.aboutYouSummary}</p>}
                                            <Link style={{ width: "unset", fontSize: "unset" }} className="btn btn-azure" to={`/profile-pictures/${g.id}`}>
                                                View Images
                                            </Link>
                                            <Link style={{ width: "unset", fontSize: "unset" }} className="btn btn-azure" to={`/profile-video/${g.id}`}>
                                                View Video
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